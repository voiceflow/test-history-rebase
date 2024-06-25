import { createSelector } from 'reselect';

import { createCurriedSelector } from '@/ducks/utils/selector';

import { threadIDParamSelector } from '../../../utils/selector.util';
import { all } from './crud.select';

export const allByThreadID = createSelector([all, threadIDParamSelector], (comments, threadID) =>
  !threadID
    ? []
    : comments
        .filter((comment) => comment.threadID === threadID)
        .sort((l, r) => new Date(l.created).getTime() - new Date(r.created).getTime())
);

export const getAllByThreadID = createCurriedSelector(allByThreadID);
