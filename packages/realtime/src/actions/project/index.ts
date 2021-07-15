import { Plugin } from '@/types';

import forgetViewer from './forgetViewer';
import identifyViewer from './identifyViewer';
import setImage from './setImage';
import setName from './setName';
import setPrivacy from './setPrivacy';

const projectActions: Plugin = (service) => service.use(identifyViewer, forgetViewer, setName, setImage, setPrivacy);

export default projectActions;
