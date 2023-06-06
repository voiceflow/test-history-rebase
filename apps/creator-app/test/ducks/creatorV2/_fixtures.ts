import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

export const WORKSPACE_ID = 'workspaceID';
export const PROJECT_ID = 'projectID';
export const VERSION_ID = 'versionID';
export const DIAGRAM_ID = 'diagramID';
export const NODE_ID = 'nodeID';
export const PORT_ID = 'portID';
export const LINK_ID = 'linkID';
export const SCHEMA_VERSION = 1;

export const ACTION_CONTEXT = {
  workspaceID: WORKSPACE_ID,
  projectID: PROJECT_ID,
  versionID: VERSION_ID,
  diagramID: DIAGRAM_ID,
};

export const PROJECT_META = {
  nlu: Platform.Constants.NLUType.VOICEFLOW,
  platform: Platform.Constants.PlatformType.VOICEFLOW,
  type: Platform.Constants.ProjectType.VOICE,
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

const remappedBlockID = 'block1';
const remappedStepID = 'step1';
const remappedPortID = 'port1';
const remappedLinkID = 'link1';
const differentBlockStepID = 'step2';
const differentBlockPortID = 'port2';

export const NODE_PORT_REMAPS_STATE = {
  links: normalize([
    {
      id: remappedLinkID,
      source: { nodeID: remappedStepID, portID: remappedPortID },
      target: { nodeID: differentBlockStepID, portID: differentBlockPortID },
    },
  ]),
  parentNodeIDByStepID: { [remappedStepID]: remappedBlockID },
  linkIDsByPortID: {
    [remappedPortID]: [remappedLinkID],
  },
};

export const NODE_PORT_REMAPS = [{ nodeID: remappedStepID, ports: [{ portID: remappedPortID }], targetNodeID: null }];

export const REVERT_NODE_PORT_REMAPS_ACTION = Realtime.link.addDynamic({
  ...ACTION_CONTEXT,
  sourceParentNodeID: remappedBlockID,
  sourceNodeID: remappedStepID,
  sourcePortID: remappedPortID,
  targetNodeID: differentBlockStepID,
  targetPortID: differentBlockPortID,
  linkID: remappedLinkID,
});
