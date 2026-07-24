import { getDeviceId } from './device-id';

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
    } catch {}
  }
};

export const track = (name: string, props?: EventProps) => send(name, props);

export const trackPageView = (path: string) => send('page_view', { path });
