import { ClientMeta, CrossTabClient } from '@logux/client';
import { Log } from '@logux/core';
import { LoguxReduxStore } from '@logux/redux';
import React from 'react';
import { AnyAction } from 'redux';

import { RealtimeState } from '@/ducks/realtimeV2';

export type RealtimeStore = LoguxReduxStore<RealtimeState, AnyAction, Log<ClientMeta>, CrossTabClient>;

export const RealtimeStoreContext = React.createContext<{ store: RealtimeStore }>(null!);
