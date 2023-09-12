import { LoguxControlOptions } from '@/legacy/control';

import AddProjectListControl from './add';
import AddProjectToListControl from './addProjectToList';
import MoveProjectListControl from './move';
import PatchProjectListControl from './patch';
import RemoveProjectListControl from './remove';
import RemoveProjectFromListControl from './removeProjectFromList';
import TransplantProjectBetweenListsControl from './transplantProjectBetweenLists';

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
