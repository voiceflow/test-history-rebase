import { Utils } from '@voiceflow/common';
import { describe, expect, it, vi } from 'vitest';

import * as History from '@/ducks/history';
import { MOCK_STATE } from '@/ducks/state.fixture';
import type { State } from '@/store/types';
import { wrapOwnAction } from '@/store/utils';

import invalidatorTransducer from './invalidator';

describe('Transducers - History - Invalidator', () => {
  describe('invalidatorTransducer()', () => {
    const clientNodeID = 'clientNodeID';
    const revertibleAction = Utils.protocol.createAction<{ value: string }>('revertible_action');
    const reverseAction = Utils.protocol.createAction<{ value: string }>('reverse_action');
    const invalidateAction = Utils.protocol.createAction('invalidate_action');
    const invalidators = {
      [invalidateAction.type]: {
        [reverseAction.type]: [
          {
            actionCreator: reverseAction,
            invalidate: () => true,
          },
        ],
      },
    };

    it('compares foreign actions against invalidators', () => {
      const reducer = vi.fn();
      const action = wrapOwnAction(invalidateAction(), 'foreign') as any;
      const rootState: State = {
        ...MOCK_STATE,
        [History.STATE_KEY]: {
          ...History.INITIAL_STATE,
          undo: [
            { id: 'transaction1', apply: [reverseAction({ value: 'reverse1' })], revert: [] },
            { id: 'transaction2', apply: [revertibleAction({ value: 'revertible2' })], revert: [] },
          ],
          redo: [
            { id: 'transaction3', apply: [revertibleAction({ value: 'revertible3' })], revert: [] },
            { id: 'transaction4', apply: [reverseAction({ value: 'reverse4' })], revert: [] },
          ],
        },
      };

      invalidatorTransducer(() => clientNodeID, invalidators)(reducer)(rootState, action);

      expect(reducer).toBeCalledTimes(2);
      expect(reducer).toBeCalledWith(
        rootState,
        History.dropTransactions({ transactionIDs: ['transaction1', 'transaction4'] })
      );
    });

    it('ignores own actions from causing invalidation', () => {
      const reducer = vi.fn();
      const action = wrapOwnAction(invalidateAction(), clientNodeID) as any;
      const rootState = {
        ...MOCK_STATE,
        [History.STATE_KEY]: {
          ...History.INITIAL_STATE,
          undo: [{ id: 'transaction1', apply: [reverseAction({ value: 'reverseAction' })], revert: [] }],
          redo: [],
        },
      };

      invalidatorTransducer(() => clientNodeID, invalidators)(reducer)(rootState, action);

      expect(reducer).toBeCalledTimes(1);
      expect(reducer).toBeCalledWith(rootState, action);
    });

    it('invalidates actions if an error is thrown', () => {
      const reducer = vi.fn();
      const action = wrapOwnAction(invalidateAction(), 'foreign') as any;
      const rootState: State = {
        ...MOCK_STATE,
        [History.STATE_KEY]: {
          ...History.INITIAL_STATE,
          undo: [
            { id: 'transaction1', apply: [reverseAction({ value: 'reverse1' })], revert: [] },
            { id: 'transaction2', apply: [revertibleAction({ value: 'revertible2' })], revert: [] },
          ],
          redo: [
            { id: 'transaction3', apply: [revertibleAction({ value: 'revertible3' })], revert: [] },
            { id: 'transaction4', apply: [reverseAction({ value: 'reverse4' })], revert: [] },
          ],
        },
      };

      invalidatorTransducer(() => clientNodeID, {
        [invalidateAction.type]: {
          [reverseAction.type]: [
            {
              actionCreator: reverseAction,
              invalidate: () => {
                throw new Error();
              },
            },
          ],
        },
      })(reducer)(rootState, action);

      expect(reducer).toBeCalledTimes(2);
      expect(reducer).toBeCalledWith(
        rootState,
        History.dropTransactions({ transactionIDs: ['transaction1', 'transaction4'] })
      );
    });
  });
});
