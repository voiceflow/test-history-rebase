import type { ActionReverter } from '@/ducks/utils';
import type { AnyAction, RootReducer } from '@/store/types';

export interface ReduxDuck<S, A extends AnyAction> {
  default: RootReducer<S, A>;
  STATE_KEY: string;
  INITIAL_STATE?: any;
  reverters?: ActionReverter<any>[];
}
