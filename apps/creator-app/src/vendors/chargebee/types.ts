import type { Chargebee as ChargebeeClient } from '@chargebee/chargebee-js-types';

declare global {
  interface Window {
    Chargebee: typeof ChargebeeClient;
  }
}
