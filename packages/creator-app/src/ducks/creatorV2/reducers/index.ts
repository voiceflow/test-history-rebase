/* eslint-disable import/no-named-as-default */
import { createRootReducer } from '@/ducks/utils/reducer';

import { INITIAL_STATE } from '../constants';
import { CreatorState } from '../types';
import addBlock, { addBlockReverter } from './addBlock';
import addBuiltInLink, { addBuiltinLinkReverter } from './addBuiltinLink';
import addBuiltinPort, { addBuiltinPortReverter } from './addBuiltinPort';
import addByKeyLink, { addByKeyLinkReverter } from './addByKeyLink';
import addByKeyPort, { addByKeyPortReverter } from './addByKeyPort';
import addDynamicLink, { addDynamicLinkReverter } from './addDynamicLink';
import addDynamicPort, { addDynamicPortReverter } from './addDynamicPort';
import addMarkup, { addMarkupReverter } from './addMarkup';
import importSnapshot from './importSnapshot';
import initialize from './initialize';
import insertStep, { insertStepReverter } from './insertStep';
import isolateSteps, { isolateStepsReverter } from './isolateSteps';
import patchManyLinks from './patchManyLinks';
import removeBuiltinPort from './removeBuiltinPort';
import removeByKeyPort from './removeByKeyPort';
import removeDynamicPort from './removeDynamicPort';
import removeManyByKeyPorts from './removeManyByKeyPorts';
import removeManyLinks, { removeManyLinksReverter } from './removeManyLinks';
import removeManyNodes from './removeManyNodes';
import reorderDynamicPorts from './reorderDynamicPorts';
import reorderSteps from './reorderSteps';
import reset from './reset';
import transplantSteps from './transplantSteps';
import updateManyNodeData, { updateManyNodeDataReverter } from './updateManyNodeData';

const creatorReducer = createRootReducer<CreatorState>(INITIAL_STATE)
  .immerCase(...initialize)
  .immerCase(...importSnapshot)
  .immerCase(...reset)

  .immerCase(...addBlock)
  .immerCase(...addMarkup)

  .immerCase(...insertStep)
  .immerCase(...isolateSteps)
  .immerCase(...transplantSteps)
  .immerCase(...reorderSteps)
  .immerCase(...removeManyNodes)
  .immerCase(...updateManyNodeData)

  .immerCase(...addByKeyPort)
  .immerCase(...addBuiltinPort)
  .immerCase(...addDynamicPort)
  .immerCase(...reorderDynamicPorts)
  .immerCase(...removeByKeyPort)
  .immerCase(...removeManyByKeyPorts)
  .immerCase(...removeBuiltinPort)
  .immerCase(...removeDynamicPort)

  .immerCase(...addByKeyLink)
  .immerCase(...addBuiltInLink)
  .immerCase(...addDynamicLink)
  .immerCase(...removeManyLinks)
  .immerCase(...patchManyLinks);

export default creatorReducer;

export const reverters = [
  addBlockReverter,
  addMarkupReverter,

  insertStepReverter,
  isolateStepsReverter,
  updateManyNodeDataReverter,

  addByKeyPortReverter,
  addBuiltinPortReverter,
  addDynamicPortReverter,

  addByKeyLinkReverter,
  addBuiltinLinkReverter,
  addDynamicLinkReverter,
  removeManyLinksReverter,
];
