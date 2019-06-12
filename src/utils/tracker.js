export function track(name, options = {}) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.info('---> track:', name, options);
  }

  window.amplitude.getInstance().logEvent(name, options);
}
