import { Utils } from '@voiceflow/common';
import { Action } from 'typescript-fsa';

import * as History from '@/ducks/history';
import { isReplayAction } from '@/ducks/utils';
import { ReverterLookup } from '@/store/types';
import { getActionID, storeLogger } from '@/store/utils';

import { createHistoryTransducer } from './utils';

const cloneAction = ({ type, payload }: Action<any>) => ({ type, payload });

const reverterTransducer = createHistoryTransducer<[ReverterLookup]>((reverters) => (state, action, { isOwnAction }) => {
  if (!isOwnAction || isReplayAction(action)) return null;

  try {
    const revertActions =
      reverters[action.type]?.flatMap((reverter) => reverter.revert(action.payload, () => state)).filter(Utils.array.isNotNullish) ?? [];

    if (!revertActions.length) return null;

    const actionID = getActionID(action)!;

    return History.pushTransaction({
      transaction: {
        // reusing the action ID to get a deterministic transaction ID
        id: actionID,
        apply: revertActions,
        revert: [cloneAction(action)],
      },
    });
  } catch (e) {
    storeLogger.error('failed to revert transaction', { action }, e);

    // if the reverter fails to generate an action we just ignore it
    return null;
  }
});

export default reverterTransducer;
