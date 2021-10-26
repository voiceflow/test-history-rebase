import { Project } from '@voiceflow/alexa-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from './utils';

const updateVendorReducer = createReducer(Realtime.project.alexa.updateVendor, (state, { projectID, creatorID, vendorID, skillID }) => {
  const project = safeGetNormalizedByKey(state, projectID);
  const member = project?.members.find((member) => member.creatorID === creatorID);

  if (member) {
    const alexaMemberData = member.platformData as Project.AlexaProjectMemberData;
    const vendor = alexaMemberData.vendors.find((vendor) => vendor.vendorID === vendorID);

    alexaMemberData.selectedVendor = vendorID;
    if (vendor) {
      vendor.skillID = skillID!;
    } else {
      alexaMemberData.vendors.push({ vendorID, skillID: skillID!, products: {} });
    }
  }
});

export default updateVendorReducer;
