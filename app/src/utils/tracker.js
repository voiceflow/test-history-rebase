export function track(name, options = {}) {
  if (process.env.NODE_ENV === 'development') {
    console.info('---> track:', name, options); // eslint-disable-line
  }

  window.amplitude.getInstance().logEvent(name, options);
}
