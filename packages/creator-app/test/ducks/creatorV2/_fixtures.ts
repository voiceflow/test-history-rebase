import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { normalize } from 'normal-store';

import { FeatureFlag } from '@/config/features';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Feature from '@/ducks/feature';

export const V2_FEATURE_STATE = {
  [Feature.STATE_KEY]: {
    features: {
      [FeatureFlag.ATOMIC_ACTIONS_PHASE_2]: { isEnabled: true },
    },
  },
};

export const WORKSPACE_ID = 'workspaceID';
export const PROJECT_ID = 'projectID';
export const VERSION_ID = 'versionID';
export const DIAGRAM_ID = 'diagramID';
export const NODE_ID = 'nodeID';
export const PORT_ID = 'portID';
export const LINK_ID = 'linkID';

export const ACTION_CONTEXT = {
  workspaceID: WORKSPACE_ID,
  projectID: PROJECT_ID,
  versionID: VERSION_ID,
  diagramID: DIAGRAM_ID,
};

export const NODE: Realtime.Node = {
  id: NODE_ID,
  parentNode: null,
  type: Realtime.BlockType.DEPRECATED,
  x: 100,
  y: 200,
  combinedNodes: [],
  ports: Realtime.Utils.port.createEmptyNodePorts(),
};

export const NODE_DATA: Realtime.NodeData<unknown> = {
  nodeID: NODE_ID,
  name: 'name',
  type: Realtime.BlockType.DEPRECATED,
};

export const PORT: Realtime.Port = {
  id: PORT_ID,
  nodeID: NODE_ID,
  label: 'first port',
  platform: VoiceflowConstants.PlatformType.ALEXA,
  virtual: false,
};

export const LINK: Realtime.Link = {
  id: LINK_ID,
  source: { nodeID: 'sourceNode', portID: 'sourcePort' },
  target: { nodeID: 'targetNode', portID: 'targetPort' },
};

export const MOCK_STATE: CreatorV2.CreatorState = {
  ...CreatorV2.INITIAL_STATE,

  activeDiagramID: DIAGRAM_ID,

  nodes: normalize([NODE_DATA], (data) => data.nodeID),
  ports: normalize([PORT]),
  links: normalize([LINK]),
};
