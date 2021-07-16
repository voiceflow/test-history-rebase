import { LoguxControlOptions } from '../../control';
import SetProjectImageControl from './setImage';
import SetProjectNameControl from './setName';
import SetProjectPrivacyControl from './setPrivacy';
import UpdateProjectViewersControl from './updateViewers';

export type ProjectActionControlMap = {
  setProjectNameControl: SetProjectNameControl;
  setProjectImageControl: SetProjectImageControl;
  setProjectPrivacyControl: SetProjectPrivacyControl;
  updateProjectViewersControl: UpdateProjectViewersControl;
};

const buildProjectActionControls = (options: LoguxControlOptions): ProjectActionControlMap => ({
  setProjectNameControl: new SetProjectNameControl(options),
  setProjectImageControl: new SetProjectImageControl(options),
  setProjectPrivacyControl: new SetProjectPrivacyControl(options),
  updateProjectViewersControl: new UpdateProjectViewersControl(options),
});

export default buildProjectActionControls;
