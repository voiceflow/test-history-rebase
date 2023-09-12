import { LoguxControlOptions } from '@/legacy/control';

import AddProjectControl from './add';
import AddManyCustomThemesController from './addManyCustomThemes';
import { UpdateDiagramViewersControl } from './awareness';
import CreateProjectControl from './create';
import DuplicateProjectControl from './duplicate';
import EjectUsersControl from './ejectUsers';
import ImportProjectControl from './importProject';
import { AddProjectMemberControl, PatchProjectMemberControl, RemoveProjectMemberControl } from './member';
import MergeProjectsControl from './merge';
import PatchProjectControl from './patch';
import PatchPlatformDataControl from './patchPlatformData';
import RemoveProjectControl from './remove';
import RemoveManyProjectsControl from './removeMany';
import ToggleWorkspaceProjectsAiAssistOffControl from './toggleWorkspaceProjectsAiAssistOff';

const buildProjectActionControls = (options: LoguxControlOptions) => ({
  ejectUsersControl: new EjectUsersControl(options),
  addProjectControl: new AddProjectControl(options),
  patchProjectControl: new PatchProjectControl(options),
  mergeProjectsControl: new MergeProjectsControl(options),
  createProjectControl: new CreateProjectControl(options),
  removeProjectControl: new RemoveProjectControl(options),
  importProjectControl: new ImportProjectControl(options),
  duplicateProjectControl: new DuplicateProjectControl(options),
  patchPlatformDataControl: new PatchPlatformDataControl(options),
  removeManyProjectsControl: new RemoveManyProjectsControl(options),
  addManyCustomThemesController: new AddManyCustomThemesController(options),
  toggleWorkspaceProjectsAiAssistOffControl: new ToggleWorkspaceProjectsAiAssistOffControl(options),

  // awareness
  updateDiagramViewersControl: new UpdateDiagramViewersControl(options),

  // members
  addProjectMemberControl: new AddProjectMemberControl(options),
  patchProjectMemberControl: new PatchProjectMemberControl(options),
  removeProjectMemberControl: new RemoveProjectMemberControl(options),
});

export default buildProjectActionControls;
