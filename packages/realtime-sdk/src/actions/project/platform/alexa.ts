import { Constants } from '@voiceflow/general-types';

import { BaseProjectPayload } from '../../../types';
import { createAction, typeFactory } from '../../utils';
import { projectType } from '../utils';

const alexaType = typeFactory(projectType(Constants.PlatformType.ALEXA));

export interface UpdateVendorPayload extends BaseProjectPayload {
  creatorID: number;
  vendorID: string;
  skillID: string | null;
}

export const updateVendor = createAction<UpdateVendorPayload>(alexaType('UPDATE_VENDOR'));
