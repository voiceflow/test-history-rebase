import React from 'react';

import { PaymentAPIContext } from './PaymentContext.component';

export const usePaymentAPI = () => {
  const paymentAPI = React.useContext(PaymentAPIContext);

  if (!paymentAPI) {
    throw new Error('Payment API is not available');
  }

  return paymentAPI;
};
