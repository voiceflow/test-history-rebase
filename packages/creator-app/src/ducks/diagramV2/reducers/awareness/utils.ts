/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';
import { getAlternativeColor } from '@voiceflow/ui';
import { Draft } from 'immer';

import { DiagramState } from '../../types';

export const createViewer = (viewer: Realtime.Viewer) => ({ ...viewer, color: getAlternativeColor(viewer.creatorID), creator_id: viewer.creatorID });

export const getViewerKey = (viewer: Realtime.Viewer): string => String(viewer.creatorID);

export const removeDiagramLocks = (state: Draft<DiagramState>) => (diagramID: string) => {
  delete state.awareness.locks[diagramID];
};
