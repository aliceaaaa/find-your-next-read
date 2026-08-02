import {
  ConsentCategory,
  apiGetConsent,
  apiStoreConsent,
  apiWithdrawConsent,
} from 'api';
import { getDeviceId, readDeviceId } from './device-id';

const STORAGE_KEY = 'cookie_consent';
const CONSENT_VERSION = 1;
const CONSENT_TTL_MS = 1000 * 60 * 60 * 24 * 365;
const CONSENT_POLICY_VERSION =
  process.env.REACT_APP_CONSENT_VERSION ?? '2026-08-01-v1';
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID ?? '';
const CONSENT_VENDORS = ['google-analytics'];
const CONSENT_PURPOSE = 'webanalytics';

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
  gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
};

const clearAnalyticsCookies = () => {
  isGaRequested = false;

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

    const age = Date.now() - new Date(parsed.updatedAt ?? '').getTime();

    if (!Number.isFinite(age) || age > CONSENT_TTL_MS) {
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
    vendors: choice.analytics ? CONSENT_VENDORS : null,
    purpose: CONSENT_PURPOSE,
  }).catch(() => {});
};

const storeConsent = (choice: ConsentChoice, updatedAt: string) => {
  const record: StoredConsent = {
    analytics: choice.analytics,
    marketing: choice.marketing,
    version: CONSENT_VERSION,
    updatedAt,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {}

  applyConsent(record);
  consentListeners.forEach((listener) => listener(record));

  return record;
};

export const setConsent = (
  choice: ConsentChoice,
  source: ConsentSource = 'banner_first',
): StoredConsent => {
  const hadConsent = getConsent() !== null;
  const record = storeConsent(choice, new Date().toISOString());

  logConsent(record, source, hadConsent);

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

const syncConsentFromServer = () => {
  const subjectId = readDeviceId();

  if (!subjectId) {
    return;
  }

  apiGetConsent(subjectId)
    .then(({ data }) => {
      if (getConsent()) {
        return;
      }

      if (data.action === 'withdrawn') {
        return;
      }

      if (data.consent_version !== CONSENT_POLICY_VERSION) {
        return;
      }

      const expiresAt = new Date(data.expires_at).getTime();

      if (Number.isFinite(expiresAt) && expiresAt < Date.now()) {
        return;
      }

      const categories = data.categories ?? [];

      storeConsent(
        {
          analytics: categories.includes('statistics'),
          marketing: categories.includes('marketing'),
        },
        data.created_at ?? new Date().toISOString(),
      );
    })
    .catch(() => {});
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
    return;
  }

  syncConsentFromServer();
};
