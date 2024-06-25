import type { AlexaProject } from '@voiceflow/alexa-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const updateVendorReducer = createReducer(
  Realtime.project.alexa.updateVendor,
  (state, { projectID, creatorID, vendorID, skillID }) => {
    const project = Normal.getOne(state, projectID);

    if (!project?.platformMembers) return;

    const member = Normal.getOne(project.platformMembers, String(creatorID));

    if (!member) return;

    const alexaMemberData = member.platformData as AlexaProject.MemberPlatformData;
    const vendor = alexaMemberData.vendors.find((vendor) => vendor.vendorID === vendorID);

    alexaMemberData.selectedVendor = vendorID;

    if (vendor) {
      vendor.skillID = skillID!;
    } else {
      alexaMemberData.vendors.push({ vendorID: vendorID!, skillID: skillID!, products: {} });
    }
  }
);

export default updateVendorReducer;
