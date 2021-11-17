import { Utils } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';

import { BaseProjectPayload } from '../../../types';
import { projectType } from '../utils';

const alexaType = Utils.protocol.typeFactory(projectType(Constants.PlatformType.ALEXA));

export interface UpdateVendorPayload extends BaseProjectPayload {
  creatorID: number;
  vendorID: string;
  skillID: string | null;
}

export const updateVendor = Utils.protocol.createAction<UpdateVendorPayload>(alexaType('UPDATE_VENDOR'));
