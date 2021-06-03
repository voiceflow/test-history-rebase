import { Plugin } from '@/types';

import appendPort from './appendPort';
import appendStep from './appendStep';
import insertStep from './insertStep';
import removePort from './removePort';
import removeStep from './removeStep';
import updateData from './updateData';

const nodeActions: Plugin = (service) => service.use(appendPort, appendStep, insertStep, removePort, removeStep, updateData);

export default nodeActions;
