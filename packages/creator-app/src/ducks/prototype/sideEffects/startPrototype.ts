import * as Realtime from '@voiceflow/realtime-sdk';
import { batch } from 'react-redux';

import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import { BlockType } from '@/constants';
import { PrototypeStatus } from '@/constants/prototype';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import * as VariableState from '@/ducks/variableState';
import { SyncThunk, ThunkDispatch } from '@/store/types';

import { pushContextHistory, pushPrototypeVisualDataHistory, updatePrototype } from '../actions';
import { prototypeVariablesSelector } from '../selectors';
import { Context } from '../types';

const INVALID_STARTING_BLOCK_TYPES = new Set([BlockType.INTENT]);

const getValidStartingNode = (
  getNodeByID: (id: string) => Realtime.Node | null,
  getLinkedNodeIDsByNodeID: (id: string) => string[],
  getLinkIDsByNodeID: (id: string) => string[],
  dispatch: ThunkDispatch,
  nodeID?: string | null
) => {
  if (!nodeID) return null;

  const targetNode = getNodeByID(nodeID);
  if (!targetNode) return null;

  // this logic is to handle the edgecase where users try to start on a intent block,
  // which doesn't work based on the data return from the intent block handler
  if (!INVALID_STARTING_BLOCK_TYPES.has(targetNode.type)) return nodeID;

  const targetParent = targetNode.parentNode ? getNodeByID(targetNode.parentNode) : null;
  const subsequentNodeID = targetParent?.combinedNodes[1];

  // has a block following intent step in same parent block
  if (subsequentNodeID) return subsequentNodeID;

  // there should only be one, since the invalid starting blocks cannot have in-ports
  const linkedNodeID = getLinkedNodeIDsByNodeID(nodeID)[0];
  const linkedNode = getNodeByID(linkedNodeID);
  const targetNodeID = linkedNode?.combinedNodes[0] ?? linkedNode?.id;

  const invalidBlockOutLinkID = getLinkIDsByNodeID(nodeID)[0];
  if (invalidBlockOutLinkID) {
    dispatch(updatePrototype({ activePathLinkIDs: [invalidBlockOutLinkID] }));
  }

  return targetNodeID;
};

const startPrototype =
  (diagramID?: string | null, selectedNodeID?: string | null): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const isVariableStateEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.VARIABLE_STATES);

    const variables = VariableState.selectedVariablesSelector(state) || prototypeVariablesSelector(state);
    const startFromNodeID = isVariableStateEnabled ? VariableState.selectedStartFromNodeIDSelector(state) : null;
    const startFromDiagramID = isVariableStateEnabled ? VariableState.selectedStartFromDiagramIDSelector(state) : null;
    const nodeID = selectedNodeID || startFromNodeID;

    const projectID = Session.activeProjectIDSelector(state);
    const activeDiagramID = Session.activeDiagramIDSelector(state);
    const getLinkIDsByNodeID = (nodeID: string) => CreatorV2.linkIDsByNodeIDSelector(state, { id: nodeID });
    const getLinkedNodeIDsByNodeID = (nodeID: string) => CreatorV2.linkedNodeIDsByNodeIDSelector(state, { id: nodeID });
    const getNodeByID = (nodeID: string) => CreatorV2.nodeByIDSelector(state, { id: nodeID });
    const targetNodeID = getValidStartingNode(getNodeByID, getLinkedNodeIDsByNodeID, getLinkIDsByNodeID, dispatch, nodeID) || undefined;
    const startNodeID = CreatorV2.startNodeIDSelector(state);

    Errors.assertDiagramID(activeDiagramID);

    const context: Context = {
      stack: [
        {
          diagramID: diagramID || startFromDiagramID || activeDiagramID,
          storage: {},
          variables: {},
          blockID: targetNodeID,
        },
      ],
      turn: {},
      trace: [],
      storage: {},
      variables: variables || {},
    };

    localStorage.setItem(`TEST_VARIABLES_${projectID}`, JSON.stringify(variables));

    let prototypeStartNodeID = startNodeID;

    if (nodeID) {
      const parentNodeID = getNodeByID(nodeID)?.parentNode;
      prototypeStartNodeID = parentNodeID || nodeID;
    }
    batch(() => {
      dispatch(updatePrototype({ activePathBlockIDs: [prototypeStartNodeID!] }));
      dispatch(pushContextHistory(context));
      dispatch(pushPrototypeVisualDataHistory(null));
      dispatch(
        updatePrototype({ status: PrototypeStatus.ACTIVE, autoplay: false, context, startTime: Date.now(), flowIDHistory: [activeDiagramID] })
      );
    });
  };
export default startPrototype;
