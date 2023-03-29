import { LoguxControlOptions } from '../../control';
import UpdateOrganizationImageControl from './updateImage';
import UpdateOrganizationNameControl from './updateName';

const buildOrganizationActionControls = (options: LoguxControlOptions) => ({
  updateOrganizationImageControl: new UpdateOrganizationImageControl(options),
  updateOrganizationNameControl: new UpdateOrganizationNameControl(options),
});

export default buildOrganizationActionControls;
