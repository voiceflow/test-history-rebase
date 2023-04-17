import { AnyAction } from 'redux';

import type { RootReducer } from '@/store/types';

export type Transducer<S, A = AnyAction> = (reducer: RootReducer<S, A>) => RootReducer<S, A>;
