import { BaseProjectPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { projectType } from '../utils';

const alexaType = Utils.protocol.typeFactory(projectType(VoiceflowConstants.PlatformType.ALEXA));

export interface UpdateVendorPayload extends BaseProjectPayload {
  creatorID: number;
  vendorID: string;
  skillID: string | null;
}

export const updateVendor = Utils.protocol.createAction<UpdateVendorPayload>(alexaType('UPDATE_VENDOR'));
