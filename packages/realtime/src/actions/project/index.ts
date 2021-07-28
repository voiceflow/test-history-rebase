import { LoguxControlOptions } from '../../control';
import LoadProjectViewersControl from './loadViewers';
import UpdateProjectViewersControl from './updateViewers';

export interface ProjectActionControlMap {
  loadProjectViewersControl: LoadProjectViewersControl;
  updateProjectViewersControl: UpdateProjectViewersControl;
}

const buildProjectActionControls = (options: LoguxControlOptions): ProjectActionControlMap => ({
  loadProjectViewersControl: new LoadProjectViewersControl(options),
  updateProjectViewersControl: new UpdateProjectViewersControl(options),
});

export default buildProjectActionControls;
