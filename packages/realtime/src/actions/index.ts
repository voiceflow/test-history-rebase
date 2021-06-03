import { Plugin } from '@/types';

import diagramActions from './diagram';
import linkActions from './link';
import nodeActions from './node';
import projectActions from './project';

const actions: Plugin = (service) => service.use(diagramActions, linkActions, nodeActions, projectActions);

export default actions;
