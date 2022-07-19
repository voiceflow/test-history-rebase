import { Utils } from '@voiceflow/common';

import suite from '@/../test/_suite';
import { MOCK_STATE } from '@/../test/ducks/_fixtures';
import { V2_HISTORY_STATE } from '@/../test/ducks/creatorV2/_fixtures';
import * as History from '@/ducks/history';
import { wrapReplayAction } from '@/ducks/utils';
import { createHistoryMiddleware } from '@/store/middleware/creatorV2';
import { extendMeta, wrapOriginAction } from '@/store/utils';

suite('Store | Middleware | Creator V2', () => {
  describe('historyMiddleware()', () => {
    const transactionID = 'transactionID';
    const clientNodeID = 'clientNodeID';
    const rootState = { ...MOCK_STATE, ...V2_HISTORY_STATE };
    const revertibleAction = Utils.protocol.createAction<{ value: string }>('revertible_action');
    const reverseAction = Utils.protocol.createAction<{ value: string }>('reverse_action');
    const invalidateAction = Utils.protocol.createAction('invalidate_action');
    const historyMiddleware = createHistoryMiddleware(
      {
        [revertibleAction.type]: [{ actionCreator: revertibleAction, revert: ({ value }) => reverseAction({ value }), invalidators: [] }],
      },
      {
        [invalidateAction.type]: {
          [reverseAction.type]: [
            {
              actionCreator: reverseAction,
              invalidate: () => true,
            },
          ],
        },
      }
    );

    it('registers reverse transaction', () => {
      const next = vi.fn();
      const dispatch = Object.assign(vi.fn(), { getNodeID: () => clientNodeID });
      const actionValue = 'actionValue';
      const baseAction = revertibleAction({ value: actionValue }) as any;
      const action = extendMeta(wrapOriginAction(baseAction, clientNodeID), { foo: 'bar' });
      vi.spyOn(Utils.id, 'cuid').mockReturnValue(transactionID);

      historyMiddleware({ dispatch, getState: () => rootState } as any)(next)(action);

      expect(dispatch).toBeCalledWith(
        History.pushTransaction({
          transaction: {
            id: transactionID,
            apply: [wrapOriginAction(reverseAction({ value: actionValue }), clientNodeID)],
            revert: [wrapOriginAction(baseAction, clientNodeID)],
          },
        })
      );
      expect(next).toBeCalledWith(action);
    });

    it('ignores action without reverters', () => {
      const next = vi.fn();
      const dispatch = Object.assign(vi.fn(), { getNodeID: () => clientNodeID });
      const action = wrapOriginAction({ type: 'mock_action', payload: null }, clientNodeID) as any;
      vi.spyOn(Utils.id, 'cuid').mockReturnValue(transactionID);

      historyMiddleware({ dispatch, getState: () => rootState } as any)(next)(action);

      expect(dispatch).not.toBeCalled();
      expect(next).toBeCalledWith(action);
    });

    it('ignores replayed action', () => {
      const next = vi.fn();
      const dispatch = Object.assign(vi.fn(), { getNodeID: () => clientNodeID });
      const action = wrapReplayAction(wrapOriginAction(revertibleAction({ value: 'actionValue' }), clientNodeID)) as any;
      vi.spyOn(Utils.id, 'cuid').mockReturnValue(transactionID);

      historyMiddleware({ dispatch, getState: () => rootState } as any)(next)(action);

      expect(dispatch).not.toBeCalled();
      expect(next).toBeCalledWith(action);
    });

    it('compares foreign actions against invalidators', () => {
      const next = vi.fn();
      const dispatch = Object.assign(vi.fn(), { getNodeID: () => clientNodeID });
      const action = wrapOriginAction(invalidateAction(), 'foreign') as any;
      const rootState = {
        ...MOCK_STATE,
        ...V2_HISTORY_STATE,
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
      vi.spyOn(Utils.id, 'cuid').mockReturnValue(transactionID);

      historyMiddleware({ dispatch, getState: () => rootState } as any)(next)(action);

      expect(dispatch).toBeCalledWith(History.dropTransactions({ transactionIDs: ['transaction1', 'transaction4'] }));
      expect(next).toBeCalledWith(action);
    });

    it('ignores own actions from causing invalidation', () => {
      const next = vi.fn();
      const dispatch = Object.assign(vi.fn(), { getNodeID: () => clientNodeID });
      const action = wrapOriginAction(invalidateAction(), clientNodeID) as any;
      const rootState = {
        ...MOCK_STATE,
        ...V2_HISTORY_STATE,
        [History.STATE_KEY]: {
          ...History.INITIAL_STATE,
          undo: [{ id: 'transaction1', apply: [reverseAction({ value: 'reverseAction' })], revert: [] }],
          redo: [],
        },
      };

      historyMiddleware({ dispatch, getState: () => rootState } as any)(next)(action);

      expect(dispatch).not.toBeCalled();
      expect(next).toBeCalledWith(action);
    });

    it('ignores action when history feature disabled', () => {
      const next = vi.fn();
      const dispatch = Object.assign(vi.fn(), { getNodeID: () => clientNodeID });
      const action = wrapOriginAction(revertibleAction({ value: 'actionValue' }), clientNodeID) as any;

      historyMiddleware({ dispatch, getState: () => MOCK_STATE } as any)(next)(action);

      expect(dispatch).not.toBeCalled();
      expect(next).toBeCalledWith(action);
    });
  });
});
