/* eslint-disable import/no-named-as-default */
import { createRootReducer } from '@/ducks/utils/reducer';

import { INITIAL_STATE } from '../constants';
import { CreatorState } from '../types';
import addBlock from './addBlock';
import addBuiltInLink from './addBuiltinLink';
import addBuiltinPort from './addBuiltinPort';
import addDynamicLink from './addDynamicLink';
import addDynamicPort from './addDynamicPort';
import addMarkup from './addMarkup';
import appendStep from './appendStep';
import importSnapshot from './importSnapshot';
import initialize from './initialize';
import insertStep from './insertStep';
import isolateStep from './isolateStep';
import patchManyLinks from './patchManyLinks';
import removeBuiltinPort from './removeBuiltinPort';
import removeDynamicPort from './removeDynamicPort';
import removeManyLinks from './removeManyLinks';
import removeManyNodes from './removeManyNodes';
import reorderDynamicPorts from './reorderDynamicPorts';
import reorderSteps from './reorderSteps';
import reset from './reset';
import transplantSteps from './transplantSteps';
import updateNodeData from './updateNodeData';

const creatorReducer = createRootReducer<CreatorState>(INITIAL_STATE)
  .immerCase(...initialize)
  .immerCase(...importSnapshot)
  .immerCase(...reset)

  .immerCase(...addBlock)
  .immerCase(...addMarkup)

  .immerCase(...appendStep)
  .immerCase(...insertStep)
  .immerCase(...isolateStep)
  .immerCase(...transplantSteps)
  .immerCase(...reorderSteps)
  .immerCase(...removeManyNodes)
  .immerCase(...updateNodeData)

  .immerCase(...addDynamicPort)
  .immerCase(...addBuiltinPort)
  .immerCase(...reorderDynamicPorts)
  .immerCase(...removeBuiltinPort)
  .immerCase(...removeDynamicPort)

  .immerCase(...addBuiltInLink)
  .immerCase(...addDynamicLink)
  .immerCase(...removeManyLinks)
  .immerCase(...patchManyLinks);

export default creatorReducer;
