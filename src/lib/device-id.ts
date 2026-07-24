const DEVICE_ID_KEY = 'device_id';

export const getDeviceId = (): string => {
  let id = localStorage.getItem(DEVICE_ID_KEY);

  if (!id) {
    id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
  }

  return id;
};
