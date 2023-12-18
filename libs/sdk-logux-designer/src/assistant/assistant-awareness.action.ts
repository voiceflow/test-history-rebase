/* Viewer */

import { Utils } from '@voiceflow/common';
import type { Viewer } from '@voiceflow/realtime-sdk';

import type { DesignerAction } from '@/types';

import { assistantAction } from './assistant.action';

const awarenessType = Utils.protocol.typeFactory(assistantAction('awareness'));

/* Replace */

export interface ReplaceViewers extends DesignerAction {
  viewers: Viewer[];
}

export const ReplaceViewers = Utils.protocol.createAction<ReplaceViewers>(awarenessType('REPLACE_VIEWERS'));
