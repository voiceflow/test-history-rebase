import type * as Realtime from '@voiceflow/realtime-sdk';
import { getAlternativeColor, isColorImage } from '@voiceflow/ui';

export const createViewer = (viewer: Realtime.Viewer) => ({
  ...viewer,
  color: viewer.image && isColorImage(viewer.image) ? viewer.image : getAlternativeColor(viewer.creatorID),
  creator_id: viewer.creatorID,
});

export const getViewerKey = (viewer: Realtime.Viewer): string => String(viewer.creatorID);
