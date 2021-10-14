import { LoguxControlOptions } from '@/control';

import AddProjectListControl from './add';
import AddProjectToListControl from './addProjectToList';
import MoveProjectListControl from './move';
import PatchProjectListControl from './patch';
import RemoveProjectListControl from './remove';
import RemoveProjectFromListControl from './removeProjectFromList';
import TransplantProjectBetweenListsControl from './transplantProjectBetweenLists';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const buildProjectListActionControls = (options: LoguxControlOptions) => ({
  addProjectListControl: new AddProjectListControl(options),
  addProjectToListControl: new AddProjectToListControl(options),
  moveProjectListControl: new MoveProjectListControl(options),
  patchProjectListControl: new PatchProjectListControl(options),
  removeProjectFromListControl: new RemoveProjectFromListControl(options),
  removeProjectListControl: new RemoveProjectListControl(options),
  transplantProjectBetweenListsControl: new TransplantProjectBetweenListsControl(options),
});

export default buildProjectListActionControls;

export type ProjectListActionControlMap = ReturnType<typeof buildProjectListActionControls>;
