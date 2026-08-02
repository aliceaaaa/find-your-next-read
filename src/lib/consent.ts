import { ConsentCategory, apiStoreConsent, apiWithdrawConsent } from 'api';
import { getDeviceId } from './device-id';

const STORAGE_KEY = 'cookie_consent';
const CONSENT_VERSION = 1;
const CONSENT_POLICY_VERSION = '1.0';
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID ?? '';

export type ConsentSource = 'banner_first' | 'banner_reopen' | 'settings_page';

export type ConsentChoice = {
  analytics: boolean;
  marketing: boolean;
};

export type StoredConsent = ConsentChoice & {
  version: number;
  updatedAt: string;
};

type GtagFn = (...args: unknown[]) => void;

type ConsentListener = (consent: StoredConsent) => void;

const consentListeners = new Set<ConsentListener>();
const settingsListeners = new Set<() => void>();

let isInitialized = false;
let isGaRequested = false;

const gtag: GtagFn = function () {
  window.dataLayer.push(arguments);
};

const ensureDataLayer = () => {
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
};

const loadGoogleAnalytics = () => {
  if (isGaRequested || !GA_MEASUREMENT_ID) {
    return;
  }

  isGaRequested = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
};

const clearAnalyticsCookies = () => {
  const host = window.location.hostname.replace(/^www\./, '');

  document.cookie.split(';').forEach((entry) => {
    const name = entry.split('=')[0].trim();

    if (!name.startsWith('_ga') && name !== '_gid') {
      return;
    }

    document.cookie = `${name}=; Max-Age=0; path=/`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${host}`;
  });
};

const applyConsent = (choice: ConsentChoice) => {
  const analytics = choice.analytics ? 'granted' : 'denied';
  const marketing = choice.marketing ? 'granted' : 'denied';

  gtag('consent', 'update', {
    analytics_storage: analytics,
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
  });

  if (choice.analytics) {
    loadGoogleAnalytics();
    return;
  }

  clearAnalyticsCookies();
};

export const getConsent = (): StoredConsent | null => {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredConsent> | null;

    if (!parsed || parsed.version !== CONSENT_VERSION) {
      return null;
    }

    if (
      typeof parsed.analytics !== 'boolean' ||
      typeof parsed.marketing !== 'boolean'
    ) {
      return null;
    }

    return parsed as StoredConsent;
  } catch {
    return null;
  }
};

export const hasAnalyticsConsent = (): boolean =>
  getConsent()?.analytics === true;

const toConsentCategories = (choice: ConsentChoice): ConsentCategory[] => {
  const categories: ConsentCategory[] = ['necessary'];

  if (choice.analytics) {
    categories.push('statistics');
  }

  if (choice.marketing) {
    categories.push('marketing');
  }

  return categories;
};

const logConsent = (
  choice: ConsentChoice,
  source: ConsentSource,
  hadConsent: boolean,
) => {
  const subjectId = getDeviceId();
  const categories = toConsentCategories(choice);

  if (hadConsent && categories.length === 1) {
    apiWithdrawConsent(subjectId, 'user_rejected_optional_cookies').catch(
      () => {},
    );

    return;
  }

  apiStoreConsent({
    subject_id: subjectId,
    action: hadConsent ? 'updated' : 'granted',
    categories,
    consent_version: CONSENT_POLICY_VERSION,
    source,
    vendors: choice.analytics ? ['google_analytics'] : null,
    purpose: 'cookie_banner',
  }).catch(() => {});
};

export const setConsent = (
  choice: ConsentChoice,
  source: ConsentSource = 'banner_first',
): StoredConsent => {
  const hadConsent = getConsent() !== null;

  const record: StoredConsent = {
    analytics: choice.analytics,
    marketing: choice.marketing,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {}

  applyConsent(record);
  logConsent(record, source, hadConsent);
  consentListeners.forEach((listener) => listener(record));

  return record;
};

export const subscribeConsent = (listener: ConsentListener) => {
  consentListeners.add(listener);

  return () => {
    consentListeners.delete(listener);
  };
};

export const openConsentSettings = () => {
  settingsListeners.forEach((listener) => listener());
};

export const subscribeConsentSettings = (listener: () => void) => {
  settingsListeners.add(listener);

  return () => {
    settingsListeners.delete(listener);
  };
};

export const initConsent = () => {
  if (isInitialized) {
    return;
  }

  isInitialized = true;

  ensureDataLayer();
  window.gtag = gtag;

  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500,
  });

  const stored = getConsent();

  if (stored) {
    applyConsent(stored);
  }
};
