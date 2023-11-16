import * as Realtime from '@voiceflow/realtime-sdk';

import * as Account from '@/ducks/account';
import * as ThreadV2 from '@/ducks/threadV2';
import type { State } from '@/store/types';

import { Transducer } from './types';

const threadAddTypes = new Set([Realtime.thread.crud.add.type, Realtime.thread.comment.add.type]);
export const legacyThreadTransducer: Transducer<State> = (rootReducer) => (state, action) => {
  let nextState = state;

  if (state && threadAddTypes.has(action.type)) {
    const userID = state[Account.STATE_KEY].creator_id;

    if (userID !== action.meta?.creatorID) {
      nextState = {
        ...state,
        [ThreadV2.STATE_KEY]: {
          ...state[ThreadV2.STATE_KEY],
          hasUnreadComments: true,
        },
      };
    }
  }

  return rootReducer(nextState, action);
};
