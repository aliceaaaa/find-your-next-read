import { getDeviceId } from './device-id';

/**
 * Minimal analytics shim. Events are logged in dev and sent via `sendBeacon`
 * to ANALYTICS_ENDPOINT when one is configured. Swap the endpoint (or the
 * `send` body) for a real provider later — call sites don't need to change.
 */
const ANALYTICS_ENDPOINT = process.env.REACT_APP_ANALYTICS_ENDPOINT ?? '';

type EventProps = Record<string, unknown>;

const send = (name: string, props?: EventProps) => {
  const event = {
    name,
    props: props ?? {},
    deviceId: getDeviceId(),
    path: window.location.pathname,
    ts: new Date().toISOString(),
  };

  if (process.env.NODE_ENV !== 'production') {
    console.debug('[analytics]', name, event.props);
  }

  if (ANALYTICS_ENDPOINT && typeof navigator.sendBeacon === 'function') {
    try {
      navigator.sendBeacon(ANALYTICS_ENDPOINT, JSON.stringify(event));
    } catch {
      /* analytics must never break the app */
    }
  }
};

export const track = (name: string, props?: EventProps) => send(name, props);

export const trackPageView = (path: string) => send('page_view', { path });
