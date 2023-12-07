import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { featureSelectorFactory } from '@/ducks/feature';
import * as ThreadLegacySelectors from '@/ducks/threadV2/selectors';
import { createCurriedSelector } from '@/ducks/utils/selector';

import { threadIDParamSelector } from '../../../utils/selector.util';
import { all } from './crud.select';

export const allByThreadID = createSelector([all, threadIDParamSelector], (comments, threadID) =>
  !threadID
    ? []
    : comments.filter((comment) => comment.threadID === threadID).sort((l, r) => new Date(l.created).getTime() - new Date(r.created).getTime())
);

const _getAllByThreadID = createCurriedSelector(allByThreadID);

export const getAllByThreadID = featureSelectorFactory(FeatureFlag.THREAD_COMMENTS)(
  ThreadLegacySelectors.getThreadCommentsByThreadIDSelector,
  _getAllByThreadID
);
