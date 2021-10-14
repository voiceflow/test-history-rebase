import { Project as AlexaProject } from '@voiceflow/alexa-types';

import { AbstractControl } from '../../control';

class ProjectMemberService extends AbstractControl {
  /**
   * @platform `alexa`
   */
  public async updateVendor(creatorID: number, projectID: string, vendorID: string, skillID: string | null): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    const member = await client.project.member.get<AlexaProject.AlexaProjectMemberData>(projectID);

    const hasVendor = member.platformData.vendors.some((vendor) => vendor.vendorID === vendorID);

    if (hasVendor) {
      await client.project.member.platformDataUpdate(projectID, 'vendors.$[vendorID].skillID', skillID, { vendorID });
    } else {
      await client.project.member.platformDataAdd(projectID, 'vendors', { vendorID, skillID, products: {} });
    }

    await client.project.member.platformDataUpdate(projectID, 'selectedVendor', vendorID);
  }
}

export default ProjectMemberService;
