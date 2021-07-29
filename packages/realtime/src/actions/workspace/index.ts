import { LoguxControlOptions } from '../../control';
import PatchWorkspaceControl from './patch';
import {
  AddProjectControl,
  ImportProjectFromFileControl,
  PatchProjectControl,
  RemoveManyProjectsControl,
  RemoveProjectControl,
  ReplaceProjectsControl,
} from './project';
import {
  AddProjectListControl,
  MoveProjectListControl,
  PatchProjectListControl,
  RemoveProjectListControl,
  ReplaceProjectListsControl,
  TransplantProjectBetweenListsControl,
} from './projectList';
import RemoveWorkspaceControl from './remove';

export interface WorkspaceActionControlMap {
  patchWorkspaceControl: PatchWorkspaceControl;
  removeWorkspaceControl: RemoveWorkspaceControl;

  addProjectControl: AddProjectControl;
  patchProjectControl: PatchProjectControl;
  removeProjectControl: RemoveProjectControl;
  replaceProjectsControl: ReplaceProjectsControl;
  removeManyProjectsControl: RemoveManyProjectsControl;
  importProjectFromFileControl: ImportProjectFromFileControl;

  addProjectListControl: AddProjectListControl;
  moveProjectListControl: MoveProjectListControl;
  patchProjectListControl: PatchProjectListControl;
  removeProjectListControl: RemoveProjectListControl;
  replaceProjectListsControl: ReplaceProjectListsControl;
  transplantProjectBetweenListsControl: TransplantProjectBetweenListsControl;
}

const buildWorkspaceActionControls = (options: LoguxControlOptions): WorkspaceActionControlMap => ({
  patchWorkspaceControl: new PatchWorkspaceControl(options),
  removeWorkspaceControl: new RemoveWorkspaceControl(options),

  addProjectControl: new AddProjectControl(options),
  patchProjectControl: new PatchProjectControl(options),
  removeProjectControl: new RemoveProjectControl(options),
  replaceProjectsControl: new ReplaceProjectsControl(options),
  removeManyProjectsControl: new RemoveManyProjectsControl(options),
  importProjectFromFileControl: new ImportProjectFromFileControl(options),

  addProjectListControl: new AddProjectListControl(options),
  moveProjectListControl: new MoveProjectListControl(options),
  patchProjectListControl: new PatchProjectListControl(options),
  removeProjectListControl: new RemoveProjectListControl(options),
  replaceProjectListsControl: new ReplaceProjectListsControl(options),
  transplantProjectBetweenListsControl: new TransplantProjectBetweenListsControl(options),
});

export default buildWorkspaceActionControls;
