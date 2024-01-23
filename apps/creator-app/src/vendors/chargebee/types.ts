// eslint-disable-next-line import/no-extraneous-dependencies
import { Chargebee as ChargebeeClient } from '@chargebee/chargebee-js-types';

declare global {
  interface Window {
    Chargebee: typeof ChargebeeClient;
  }
}
