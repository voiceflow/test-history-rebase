import { Utils } from '@voiceflow/common';
import { Action } from 'typescript-fsa';

import * as History from '@/ducks/history';
import { isReplayAction } from '@/ducks/utils';
import { ReverterLookup } from '@/store/types';
import { getActionID } from '@/store/utils';

import { createHistoryTransducer } from './utils';

const cloneAction = ({ type, payload }: Action<any>) => ({ type, payload });

const reverterTransducer = createHistoryTransducer((reverters: ReverterLookup) => (state, action, { isOwnAction }) => {
  if (!isOwnAction || isReplayAction(action)) return null;

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
});

export default reverterTransducer;
