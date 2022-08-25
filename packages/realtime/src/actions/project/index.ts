import { LoguxControlOptions } from '@/control';

import AddProjectControl from './add';
import { UpdateProjectViewersControl } from './awareness';
import CreateProjectControl from './create';
import DuplicateProjectControl from './duplicate';
import EjectUsersControl from './ejectUsers';
import ImportProjectFromFileControl from './importFromFile';
import PatchProjectControl from './patch';
import AlexaUpdateVendorControl from './platform/alexa/updateVendor';
import RemoveProjectControl from './remove';
import RemoveManyProjectsControl from './removeMany';

const buildProjectActionControls = (options: LoguxControlOptions) => ({
  addProjectControl: new AddProjectControl(options),
  alexaUpdateVendorControl: new AlexaUpdateVendorControl(options),
  createProjectControl: new CreateProjectControl(options),
  duplicateProjectControl: new DuplicateProjectControl(options),
  patchProjectControl: new PatchProjectControl(options),
  removeProjectControl: new RemoveProjectControl(options),
  removeManyProjectsControl: new RemoveManyProjectsControl(options),
  importProjectFromFileControl: new ImportProjectFromFileControl(options),
  ejectUsers: new EjectUsersControl(options),

  // awareness
  updateProjectViewersControl: new UpdateProjectViewersControl(options),
});

export default buildProjectActionControls;
