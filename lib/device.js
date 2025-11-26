export function getDeviceId() {
  const key = process.env.NEXT_PUBLIC_DEVICE_ID_KEY || 'lex_device_id';
  if (typeof window === 'undefined') return null;

  let id = localStorage.getItem(key);
  if (!id) {
    id = (crypto?.randomUUID && crypto.randomUUID()) ||
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random()*16)|0, v = c === 'x' ? r : (r&0x3)|0x8;
        return v.toString(16);
      });
    localStorage.setItem(key, id);
  }
  return id;
}