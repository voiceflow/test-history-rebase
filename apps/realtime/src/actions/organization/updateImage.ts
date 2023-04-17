import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractOrganizationChannelControl } from './utils';

class UpdateOrganizationImage extends AbstractOrganizationChannelControl<Realtime.organization.UpdateOrganizationImagePayload> {
  protected actionCreator = Realtime.organization.updateImage;

  protected process = Utils.functional.noop;
}

export default UpdateOrganizationImage;
