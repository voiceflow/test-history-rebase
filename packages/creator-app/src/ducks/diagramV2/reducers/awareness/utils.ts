/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';
import { getAlternativeColor } from '@voiceflow/ui';

// eslint-disable-next-line import/prefer-default-export
export const createViewer = (viewer: Realtime.Viewer) => ({ ...viewer, color: getAlternativeColor(viewer.creatorID), creator_id: viewer.creatorID });
