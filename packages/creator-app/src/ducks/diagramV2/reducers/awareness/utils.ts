import * as Realtime from '@voiceflow/realtime-sdk';
import { getAlternativeColor } from '@voiceflow/ui';

export const createViewer = (viewer: Realtime.Viewer) => ({ ...viewer, color: getAlternativeColor(viewer.creatorID), creator_id: viewer.creatorID });

export const getViewerKey = (viewer: Realtime.Viewer): string => String(viewer.creatorID);
