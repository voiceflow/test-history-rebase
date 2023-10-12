import * as Normal from 'normal-store';

import { CreatorState } from './types';

export const STATE_KEY = 'creatorV2';

export const createEmptyState = (): CreatorState => ({
  activeDiagramID: null,

  nodes: Normal.createEmpty(),
  ports: Normal.createEmpty(),
  links: Normal.createEmpty(),

  blockIDs: [],
  markupIDs: [],
  actionsIDs: [],
  coordsByNodeID: {},

  portsByNodeID: {},
  linkIDsByNodeID: {},
  parentNodeIDByStepID: {},
  stepIDsByParentNodeID: {},

  nodeIDByPortID: {},
  linkIDsByPortID: {},

  nodeIDsByLinkID: {},
  portIDsByLinkID: {},
});

export const createInitializeState = (state?: CreatorState): CreatorState => ({
  ...state,
  ...createEmptyState(),
});

export const INITIAL_STATE = createEmptyState();
