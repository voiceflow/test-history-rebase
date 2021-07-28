import { LoguxControlOptions } from '../../control';
import PatchWorkspaceControl from './patch';
import { AddProjectControl, RemoveProjectControl } from './project';
import { AddProjectListControl, PatchProjectListControl, RemoveProjectListControl, TransplantProjectBetweenListsControl } from './projectList';
import RemoveWorkspaceControl from './remove';

export interface WorkspaceActionControlMap {
  patchWorkspaceControl: PatchWorkspaceControl;
  removeWorkspaceControl: RemoveWorkspaceControl;

  addProjectControl: AddProjectControl;
  removeProjectControl: RemoveProjectControl;

  addProjectListControl: AddProjectListControl;
  patchProjectListControl: PatchProjectListControl;
  removeProjectListControl: RemoveProjectListControl;
  transplantProjectBetweenListsControl: TransplantProjectBetweenListsControl;
}

const buildWorkspaceActionControls = (options: LoguxControlOptions): WorkspaceActionControlMap => ({
  patchWorkspaceControl: new PatchWorkspaceControl(options),
  removeWorkspaceControl: new RemoveWorkspaceControl(options),

  addProjectControl: new AddProjectControl(options),
  removeProjectControl: new RemoveProjectControl(options),

  addProjectListControl: new AddProjectListControl(options),
  patchProjectListControl: new PatchProjectListControl(options),
  removeProjectListControl: new RemoveProjectListControl(options),
  transplantProjectBetweenListsControl: new TransplantProjectBetweenListsControl(options),
});

export default buildWorkspaceActionControls;
