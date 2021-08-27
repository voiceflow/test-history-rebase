import { matchPath } from 'react-router-dom';
import { createSelector } from 'reselect';

import { ProjectRoute, RootRoute } from '@/config/routes';
import { pathnameSelector } from '@/ducks/router/selectors';
import { createCRUDSelectors } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

export const {
  root: rootTranscriptsSelector,
  map: mapTranscriptsSelector,
  all: allTranscriptsSelector,
  byID: transcriptByIDSelector,
  findByIDs: transcriptsByIDsSelector,
  has: hasTranscriptsSelector,
} = createCRUDSelectors(STATE_KEY);

export const currentTranscriptIDSelector = createSelector([mapTranscriptsSelector, pathnameSelector], (_transcripts, pathname) => {
  const match: { params: { transcriptID: string | undefined } } | null = matchPath(pathname, {
    path: `/${RootRoute.PROJECT}/:id/${ProjectRoute.CONVERSATIONS}/:transcriptID?`,
  });

  return match?.params.transcriptID ?? null;
});

export const currentTranscriptSelector = createSelector([mapTranscriptsSelector, currentTranscriptIDSelector], (transcripts, transcriptID) => {
  return transcriptID ? transcripts[transcriptID] : null;
});

export const hasUnreadTranscriptsSelector = createSelector([rootTranscriptsSelector], ({ hasUnreadTranscripts }) => hasUnreadTranscripts);
