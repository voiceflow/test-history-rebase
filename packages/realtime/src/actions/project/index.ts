import { Plugin } from '@/types';

import setImage from './setImage';
import setName from './setName';
import setPrivacy from './setPrivacy';

const projectActions: Plugin = (service) => service.use(setName, setImage, setPrivacy);

export default projectActions;
