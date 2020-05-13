declare module 'react-intercom' {
  import React from 'react';

  export type UpdateOptions = Partial<{
    debug: boolean;
    hide_default_launcher: boolean;
  }>;

  export function IntercomAPI(action: 'trackEvent', event: string, properties?: Record<string, string>): void;
  export function IntercomAPI(action: 'update', options: UpdateOptions): void;

  export type IntercomProps = {
    appID: string;
    [key: string]: any;
  };

  const Intercom: React.FC<IntercomProps>;

  export default Intercom;
}
