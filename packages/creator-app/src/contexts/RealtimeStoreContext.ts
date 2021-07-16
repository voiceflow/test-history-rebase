import React from 'react';
import { ReactReduxContextValue } from 'react-redux';

import { RealtimeState } from '@/ducks/realtimeV2';

export const RealtimeStoreContext = React.createContext<ReactReduxContextValue<RealtimeState>>(null!);
