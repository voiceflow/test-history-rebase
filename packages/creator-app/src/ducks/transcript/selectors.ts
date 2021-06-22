import { getLocation } from 'connected-react-router';
import { matchPath } from 'react-router-dom';
import { createSelector } from 'reselect';

import { ProjectRoute, RootRoute } from '@/config/routes';
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

export const currentSelectedTranscriptSelector = createSelector([mapTranscriptsSelector, getLocation], (transcripts, location) => {
  const match: { params: { transcriptID: string | undefined } } | null = matchPath(location.pathname, {
    path: `/${RootRoute.PROJECT}/:id/${ProjectRoute.CONVERSATIONS}/:transcriptID?`,
  });

  const transcriptID = match?.params.transcriptID;
  return transcripts[transcriptID!];
});

export const currentTranscriptIDSelector = createSelector([mapTranscriptsSelector, getLocation], (_transcripts, location) => {
  const match: { params: { transcriptID: string | undefined } } | null = matchPath(location.pathname, {
    path: `/${RootRoute.PROJECT}/:id/${ProjectRoute.CONVERSATIONS}/:transcriptID?`,
  });
  return match?.params.transcriptID;
});
