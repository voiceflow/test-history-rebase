import React from 'react';

import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import CancelPaymentStep from '.';

export default {
  title: 'Creator/Steps/Cancel Payment Step',
  component: CancelPaymentStep,
};

export const empty = () => (
  <NewBlock name="Cancel Payment Block">
    <CancelPaymentStep />
  </NewBlock>
);

export const withProduct = () => (
  <NewBlock name="Cancel Payment Block">
    <CancelPaymentStep label="New York Times Quiz Pack" />
  </NewBlock>
);
