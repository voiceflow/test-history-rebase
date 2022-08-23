import { Utils } from '@voiceflow/common';

import suite from '@/../test/_suite';
import { MOCK_STATE } from '@/../test/ducks/_fixtures';
import * as History from '@/ducks/history';
import reverterTransducer from '@/ducks/transducers/history/reverter';
import { wrapReplayAction } from '@/ducks/utils';
import { extendMeta, wrapOwnAction } from '@/store/utils';

suite('Transducers - History - Reverter', () => {
  describe('reverterTransducer()', () => {
    const clientNodeID = 'clientNodeID';
    const actionID = 'actionID';
    const revertibleAction = Utils.protocol.createAction<{ value: string }>('revertible_action');
    const reverseAction = Utils.protocol.createAction<{ value: string }>('reverse_action');
    const rootState = MOCK_STATE;
    const reverters = {
      [revertibleAction.type]: [
        {
          actionCreator: revertibleAction,
          revert: ({ value }: { value: string }) => reverseAction({ value }),
          invalidators: [],
        },
      ],
    };

    it('registers reverse transaction', () => {
      const reducer = vi.fn();
      const actionValue = 'actionValue';
      const baseAction = revertibleAction({ value: actionValue }) as any;
      const action = extendMeta(wrapOwnAction(baseAction, clientNodeID, actionID), { foo: 'bar' });

      reverterTransducer(() => clientNodeID, reverters)(reducer)(rootState, action);

      expect(reducer).toBeCalledTimes(2);
      expect(reducer).toBeCalledWith(
        rootState,
        History.pushTransaction({
          transaction: {
            id: actionID,
            apply: [reverseAction({ value: actionValue })],
            revert: [baseAction],
          },
        })
      );
    });

    it('ignores action without reverters', () => {
      const reducer = vi.fn();
      const action = wrapOwnAction({ type: 'mock_action', payload: null }, clientNodeID, actionID) as any;

      reverterTransducer(() => clientNodeID, reverters)(reducer)(rootState, action);

      expect(reducer).toBeCalledTimes(1);
    });

    it('ignores replayed action', () => {
      const reducer = vi.fn();
      const action = wrapReplayAction(wrapOwnAction(revertibleAction({ value: 'actionValue' }), clientNodeID)) as any;

      reverterTransducer(() => clientNodeID, reverters)(reducer)(rootState, action);

      expect(reducer).toBeCalledTimes(1);
    });

    it('ignores action if reverter fails', () => {
      const reducer = vi.fn();
      const actionValue = 'actionValue';
      const baseAction = revertibleAction({ value: actionValue }) as any;
      const action = extendMeta(wrapOwnAction(baseAction, clientNodeID, actionID), { foo: 'bar' });

      reverterTransducer(() => clientNodeID, {
        [revertibleAction.type]: [
          {
            actionCreator: revertibleAction,
            revert: () => {
              throw new Error();
            },
            invalidators: [],
          },
        ],
      })(reducer)(rootState, action);

      expect(reducer).toBeCalledTimes(1);
    });
  });
});
