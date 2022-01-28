/* eslint-disable import/no-named-as-default */
import { createRootReducer } from '@/ducks/utils/reducer';

import { INITIAL_STATE } from '../constants';
import { CreatorState } from '../types';
import addBlock from './addBlock';
import addBuiltinPort from './addBuiltinPort';
import addDynamicPort from './addDynamicPort';
import addLink from './addLink';
import addMarkup from './addMarkup';
import appendStep from './appendStep';
import initialize from './initialize';
import insertStep from './insertStep';
import isolateStep from './isolateStep';
import removeLink from './removeLink';
import removeManyNodes from './removeManyNodes';
import removePort from './removePort';
import reorderDynamicPorts from './reorderDynamicPorts';
import reset from './reset';

const creatorReducer = createRootReducer<CreatorState>(INITIAL_STATE)
  .immerCase(...initialize)
  .immerCase(...reset)

  .immerCase(...addBlock)
  .immerCase(...addMarkup)

  .immerCase(...appendStep)
  .immerCase(...insertStep)
  .immerCase(...isolateStep)
  .immerCase(...removeManyNodes)

  .immerCase(...addDynamicPort)
  .immerCase(...addBuiltinPort)
  .immerCase(...reorderDynamicPorts)
  .immerCase(...removePort)

  .immerCase(...addLink)
  .immerCase(...removeLink);

export default creatorReducer;
