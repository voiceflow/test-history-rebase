import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import * as Payment from '@/contexts/PaymentContext';

export const withStripe = <P extends object, E = unknown>(Component: React.ComponentType<P>) =>
  setDisplayName(wrapDisplayName(Component, 'withStripe'))(
    React.forwardRef<E, P>((props, ref) => {
      return (
        <Payment.legacy.PaymentProvider>
          <Component {...props} ref={ref} />
        </Payment.legacy.PaymentProvider>
      );
    })
  );
