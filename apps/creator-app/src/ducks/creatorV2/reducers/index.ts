/* eslint-disable import/no-named-as-default */
import { createRootReducer } from '@/ducks/utils/reducer';

import { INITIAL_STATE } from '../constants';
import { CreatorState } from '../types';
import addActions, { addActionsReverted } from './addActions';
import addBlock, { addBlockReverter } from './addBlock';
import addBuiltInLink, { addBuiltinLinkReverter } from './addBuiltinLink';
import addBuiltinPort, { addBuiltinPortReverter } from './addBuiltinPort';
import addByKeyLink, { addByKeyLinkReverter } from './addByKeyLink';
import addByKeyPort, { addByKeyPortReverter } from './addByKeyPort';
import addDynamicLink, { addDynamicLinkReverter } from './addDynamicLink';
import addDynamicPort, { addDynamicPortReverter } from './addDynamicPort';
import addMarkup, { addMarkupReverter } from './addMarkup';
import importSnapshot, { importSnapshotReverter } from './importSnapshot';
import initialize from './initialize';
import insertManySteps, { insertManyStepsReverter } from './insertManySteps';
import insertStep, { insertStepReverter } from './insertStep';
import isolateSteps, { isolateStepsReverter } from './isolateSteps';
import moveManyNodes, { moveManyNodesReverter } from './moveManyNodes';
import patchManyLinks, { patchManyLinksReverter } from './patchManyLinks';
import removeBuiltinPort, { removeBuiltinPortReverter } from './removeBuiltinPort';
import removeDynamicPort, { removeDynamicPortReverter } from './removeDynamicPort';
import removeManyByKeyPorts, { removeManyByKeyPortsReverter } from './removeManyByKeyPorts';
import removeManyLinks, { removeManyLinksReverter } from './removeManyLinks';
import removeManyNodes, { removeManyNodesReverter } from './removeManyNodes';
import reorderDynamicPorts, { reorderDynamicPortsReverter } from './reorderDynamicPorts';
import reorderSteps, { reorderStepsReverter } from './reorderSteps';
import reset from './reset';
import resetActive from './resetActive';
import addCustomBlockPortReducer, { addCustomBlockPortReverter } from './syncCustomBlockPort';
import transplantSteps, { transplantStepsReverter } from './transplantSteps';
import updateManyNodeData, { updateManyNodeDataReverter } from './updateManyNodeData';

const creatorReducer = createRootReducer<CreatorState>(INITIAL_STATE)
  .immerCase(...reset)
  .immerCase(...initialize)
  .immerCase(...importSnapshot)
  .immerCase(...resetActive)

  .immerCase(...addBlock)
  .immerCase(...addMarkup)
  .immerCase(...addActions)

  .immerCase(...insertStep)
  .immerCase(...insertManySteps)
  .immerCase(...isolateSteps)
  .immerCase(...transplantSteps)
  .immerCase(...reorderSteps)
  .immerCase(...removeManyNodes)
  .immerCase(...updateManyNodeData)
  .immerCase(...moveManyNodes)

  .immerCase(...addByKeyPort)
  .immerCase(...addBuiltinPort)
  .immerCase(...addDynamicPort)
  .immerCase(...reorderDynamicPorts)
  .immerCase(...removeManyByKeyPorts)
  .immerCase(...removeBuiltinPort)
  .immerCase(...removeDynamicPort)

  .immerCase(...addByKeyLink)
  .immerCase(...addBuiltInLink)
  .immerCase(...addDynamicLink)
  .immerCase(...removeManyLinks)
  .immerCase(...patchManyLinks)

  .immerCase(...addCustomBlockPortReducer);

export default creatorReducer;

export const reverters = [
  importSnapshotReverter,

  addBlockReverter,
  addMarkupReverter,
  addActionsReverted,

  insertStepReverter,
  insertManyStepsReverter,
  isolateStepsReverter,
  reorderStepsReverter,
  removeManyNodesReverter,
  transplantStepsReverter,
  updateManyNodeDataReverter,
  moveManyNodesReverter,

  addByKeyPortReverter,
  addBuiltinPortReverter,
  addDynamicPortReverter,
  reorderDynamicPortsReverter,
  removeManyByKeyPortsReverter,
  removeBuiltinPortReverter,
  removeDynamicPortReverter,

  addByKeyLinkReverter,
  addBuiltinLinkReverter,
  addDynamicLinkReverter,
  patchManyLinksReverter,
  removeManyLinksReverter,

  addCustomBlockPortReverter,
];
