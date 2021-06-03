import { Plugin } from '@/types';

import add from './add';
import remove from './remove';
import updateData from './updateData';

const linkActions: Plugin = (service) => service.use(add, remove, updateData);

export default linkActions;
