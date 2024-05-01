import type { Nullable } from '@voiceflow/common';
import type { Action, ActionCreator, AnyAction as AnyFSAction } from 'typescript-fsa';
import { expect } from 'vitest';

import type { State } from '@/ducks';
import type { AnyAction } from '@/store/types';

import type { ReduxDuck } from './redux-duck.interface';

export interface ReverterUtils<Payload> {
  revertAction: (rootState: State, payload: Payload) => Nullable<Action<any>> | Nullable<Action<any>>[] | undefined;
  expectToInvalidate: (origin: Action<Payload>, subject: AnyFSAction) => void;
  expectToIgnore: (origin: Action<Payload>, subject: AnyFSAction) => void;
}

export const createReverterUtilsFactory =
  <DuckState, DuckAction extends AnyAction>(Duck: ReduxDuck<DuckState, DuckAction>) =>
  <Payload>(actionCreator: ActionCreator<Payload>): ReverterUtils<Payload> => {
    const checkInvalidate = (origin: Action<Payload>, subject: AnyFSAction) => {
      const reverter = Duck.reverters?.find((reverter) => reverter.actionCreator.match(subject));

      expect(reverter).toBeTruthy();

      const invalidator = reverter?.invalidators.find((invalidator) => invalidator.actionCreator.match(subject));

      expect(invalidator).toBeTruthy();

      return !!invalidator?.invalidate(origin, subject);
    };

    return {
      revertAction: (rootState, payload) => {
        const reverter = Duck.reverters?.find((reverter) => reverter.actionCreator === actionCreator);

        if (!reverter) {
          throw new Error(`should register a reverter for the ${actionCreator.type} action`);
        }

        return reverter?.revert(payload, () => rootState);
      },

      expectToInvalidate: (origin, subject) => {
        return expect(checkInvalidate(origin, subject)).toBeTruthy();
      },

      expectToIgnore: (origin, subject) => {
        return expect(checkInvalidate(origin, subject)).toBeFalsy();
      },
    };
  };
