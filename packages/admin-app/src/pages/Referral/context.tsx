import { useContextApi, useSmartReducerV2, withProvider } from '@voiceflow/ui';
import React from 'react';

import { ReferralContextAPI } from './types';

export const DEFAULT_STATE = {
  code: '',
  coupon: '',
  product: '',
  redemptionLimit: null,
  expiry: '',
  status: true,
  creatorID: null,
};

export const ReferralContext = React.createContext<ReferralContextAPI | null>(null);
export const { Consumer: ReferralContextConsumer } = ReferralContext;

export const ReferralContextProvider: React.FC = ({ children }) => {
  const [state, actions] = useSmartReducerV2(DEFAULT_STATE);

  const api = useContextApi({ state, actions });

  return <ReferralContext.Provider value={api}>{children}</ReferralContext.Provider>;
};

export const withReferralProvider = withProvider(ReferralContextProvider);
