import * as Normal from 'normal-store';

import { CreatorState } from './types';

export const STATE_KEY = 'creatorV2';

export const createInitialState = (): CreatorState => ({
  activeDiagramID: null,

  nodes: Normal.createEmpty(),
  ports: Normal.createEmpty(),
  links: Normal.createEmpty(),

  blockIDs: [],
  markupIDs: [],
  coordsByNodeID: {},

  portsByNodeID: {},
  linkIDsByNodeID: {},
  blockIDByStepID: {},
  stepIDsByBlockID: {},

  nodeIDByPortID: {},
  linkIDsByPortID: {},

  nodeIDsByLinkID: {},
  portIDsByLinkID: {},
});

export const INITIAL_STATE = createInitialState();
