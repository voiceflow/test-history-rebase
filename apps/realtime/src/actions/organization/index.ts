import { LoguxControlOptions } from '../../control';
import { RemoveOrganizationMemberControl } from './member';
import UpdateOrganizationImageControl from './updateImage';
import UpdateOrganizationNameControl from './updateName';

const buildOrganizationActionControls = (options: LoguxControlOptions) => ({
  updateOrganizationNameControl: new UpdateOrganizationNameControl(options),
  updateOrganizationImageControl: new UpdateOrganizationImageControl(options),

  // member
  removeOrganizationMemberControl: new RemoveOrganizationMemberControl(options),
});

export default buildOrganizationActionControls;
