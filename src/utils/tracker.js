import { IS_DEVELOPMENT } from '@/config';

// eslint-disable-next-line import/prefer-default-export
export function track(name, options = {}) {
  if (IS_DEVELOPMENT) {
    // eslint-disable-next-line no-console
    console.info('---> track:', name, options);
  }

  window.amplitude.getInstance().logEvent(name, options);
}
