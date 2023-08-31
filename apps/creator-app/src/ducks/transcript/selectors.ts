import { matchPath } from 'react-router-dom';
import { createSelector } from 'reselect';

import { Path } from '@/config/routes';
import { pathnameSelector } from '@/ducks/router/selectors';
import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

export const {
  root: rootTranscriptsSelector,
  map: mapTranscriptsSelector,
  all: allTranscriptsSelector,
  byID: transcriptByIDSelector,
} = createCRUDSelectors(STATE_KEY);

export const currentTranscriptIDSelector = createSelector([pathnameSelector], (pathname) => {
  const match = matchPath<{ transcriptID?: string }>(pathname, { path: Path.CONVERSATIONS });

  return match?.params.transcriptID ?? null;
});

export const currentTranscriptSelector = createSelector([mapTranscriptsSelector, currentTranscriptIDSelector], (transcripts, transcriptID) => {
  return transcriptID ? transcripts[transcriptID] : null;
});

export const hasUnreadTranscriptsSelector = createSelector([rootTranscriptsSelector], ({ hasUnreadTranscripts }) => hasUnreadTranscripts);
