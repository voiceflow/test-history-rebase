import { Plugin } from '@/types';

import addBlocks from './addBlocks';
import dragBlocks from './dragBlocks';
import moveBlocks from './moveBlocks';
import moveCursor from './moveCursor';
import removeBlocks from './removeBlocks';

const diagramActions: Plugin = (service) => service.use(addBlocks, dragBlocks, moveBlocks, removeBlocks, moveCursor);

export default diagramActions;
