import { Actions } from '@voiceflow/sdk-logux-designer';

import * as Account from '@/ducks/account';
import { STATE_KEY as DESIGNER_STATE_KEY } from '@/ducks/designer/designer.state';
import { STATE_KEY as THREAD_STATE_KEY } from '@/ducks/designer/thread/thread.state';
import type { State } from '@/store/types';

import { Transducer } from './types';

const threadAddTypes = new Set([Actions.Thread.AddOne.type, Actions.ThreadComment.AddOne]);
export const threadTransducer: Transducer<State> = (rootReducer) => (state, action) => {
  let nextState = state;

  if (state && threadAddTypes.has(action.type)) {
    const userID = state[Account.STATE_KEY].creator_id;

    if (userID !== action.meta?.creatorID) {
      nextState = {
        ...state,
        [DESIGNER_STATE_KEY]: {
          ...state[DESIGNER_STATE_KEY],

          [THREAD_STATE_KEY]: {
            ...state[DESIGNER_STATE_KEY][THREAD_STATE_KEY],
            hasUnreadComments: true,
          },
        },
      };
    }
  }

  return rootReducer(nextState, action);
};
