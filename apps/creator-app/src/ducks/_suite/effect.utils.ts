import type { Eventual } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import type { AnyAction as AnyFSAction } from 'typescript-fsa';
import { vi } from 'vitest';

import type { State } from '@/ducks';
import type { AnyAction, Dispatch, Dispatchable, SyncThunk } from '@/store/types';

const createDispatch = (
  handler: (dispatchable: Dispatchable) => any = Utils.functional.noop,
  loguxHandler: (key: keyof Dispatch) => (action: AnyFSAction) => any = () => Utils.functional.noop
): Dispatch =>
  Object.assign(vi.fn(handler), {
    local: vi.fn(loguxHandler('local')),
    crossTab: vi.fn(loguxHandler('crossTab')),
    sync: vi.fn(loguxHandler('sync')),
    partialSync: vi.fn(loguxHandler('partialSync')),
    getNodeID: () => 'mockNodeID',
  });

export interface EffectUtils<Args extends any[], Result> {
  applyEffect: (
    state: State,
    ...args: Args
  ) => Promise<{
    dispatch: ReturnType<typeof createDispatch>;
    dispatched: (AnyAction | Partial<Record<keyof Dispatch, AnyFSAction>>)[];
    result: Result;
  }>;
}

export const createEffectUtils = <Args extends any[], Result>(
  sideEffect: (...args: Args) => SyncThunk<Eventual<Result>>
): EffectUtils<Args, Result> => ({
  applyEffect: async (state: State, ...args: Args) => {
    const dispatched: (AnyAction | Partial<Record<keyof Dispatch, AnyFSAction>>)[] = [];
    const getState = () => state;
    const dispatch = createDispatch(
      (dispatchable) => {
        if (typeof dispatchable === 'function') {
          return dispatchable(dispatch, getState, {} as any);
        }

        dispatched.push(dispatchable as AnyAction);

        return dispatchable;
      },
      (key) => (action) => {
        dispatched.push({ [key]: action });
      }
    );
    const thunk = sideEffect(...args);

    const result = await thunk(dispatch, getState, { log: { type: vi.fn() }, client: { type: vi.fn() } } as any);

    return { dispatch, dispatched, result };
  },
});
