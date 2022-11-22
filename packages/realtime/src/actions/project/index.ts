import { LoguxControlOptions } from '@/control';

import AddProjectControl from './add';
import AddManyCustomThemesController from './addManyCustomThemes';
import { UpdateDiagramViewersControl } from './awareness';
import CreateProjectControl from './create';
import DuplicateProjectControl from './duplicate';
import EjectUsersControl from './ejectUsers';
import ImportProjectFromFileControl from './importFromFile';
import MergeProjectsControl from './merge';
import PatchProjectControl from './patch';
import PatchPlatformDataControl from './patchPlatformData';
import AlexaUpdateVendorControl from './platform/alexa/updateVendor';
import RemoveProjectControl from './remove';
import RemoveManyProjectsControl from './removeMany';

const buildProjectActionControls = (options: LoguxControlOptions) => ({
  ejectUsersControl: new EjectUsersControl(options),
  addProjectControl: new AddProjectControl(options),
  patchProjectControl: new PatchProjectControl(options),
  mergeProjectsControl: new MergeProjectsControl(options),
  createProjectControl: new CreateProjectControl(options),
  removeProjectControl: new RemoveProjectControl(options),
  duplicateProjectControl: new DuplicateProjectControl(options),
  patchPlatformDataControl: new PatchPlatformDataControl(options),
  alexaUpdateVendorControl: new AlexaUpdateVendorControl(options),
  removeManyProjectsControl: new RemoveManyProjectsControl(options),
  importProjectFromFileControl: new ImportProjectFromFileControl(options),
  addManyCustomThemesController: new AddManyCustomThemesController(options),

  // awareness
  updateDiagramViewersControl: new UpdateDiagramViewersControl(options),
});

export default buildProjectActionControls;
