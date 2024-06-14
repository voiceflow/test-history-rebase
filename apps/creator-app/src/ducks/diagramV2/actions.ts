import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

interface SetLastCreatedIDPayload {
  id: string | null;
}

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
export const setLastCreatedID = Utils.protocol.createAction<SetLastCreatedIDPayload>(
  Realtime.diagram.utils.diagramType('set_last_created_id')
);
