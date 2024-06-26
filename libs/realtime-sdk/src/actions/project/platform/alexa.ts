import type { BaseProjectPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config/backend';

import { projectType } from '../utils';

const alexaType = Utils.protocol.typeFactory(projectType(Platform.Constants.PlatformType.ALEXA));

export interface UpdateVendorPayload extends BaseProjectPayload {
  skillID: string | null;
  vendorID: string | null;
  creatorID: number;
}

export const updateVendor = Utils.protocol.createAction<UpdateVendorPayload>(alexaType('UPDATE_VENDOR'));
