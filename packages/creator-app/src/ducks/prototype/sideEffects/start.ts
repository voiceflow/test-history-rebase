import { batch } from 'react-redux';

import * as Errors from '@/config/errors';
import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Session from '@/ducks/session';
import { Node } from '@/models';
import { SyncThunk, ThunkDispatch } from '@/store/types';

import { pushContextHistory, pushPrototypeVisualDataHistory, updatePrototype } from '../actions';
import { prototypeVariablesSelector } from '../selectors';
import { Context, PrototypeStatus } from '../types';

const INVALID_STARTING_BLOCK_TYPES = [BlockType.INTENT];

const getValidStartingNode = (
  getNodeByID: (id: string) => Node,
  getLinkedNodeIDsByNodeID: (id: string) => string[],
  getLinkIDsByNodeID: (id: string) => string[],
  dispatch: ThunkDispatch,
  nodeID?: string | null
) => {
  if (!nodeID) return null;

  const targetNode = getNodeByID(nodeID);

  // this logic is to handle the edgecase where users try to start on a intent block,
  // which doesn't work based on the data return from the intent block handler
  if (!INVALID_STARTING_BLOCK_TYPES.includes(targetNode.type)) return nodeID;

  const targetParent = targetNode.parentNode ? getNodeByID(targetNode.parentNode) : null;
  const subsequentNodeID = targetParent?.combinedNodes[1];

  // has a block following intent step in same parent block
  if (subsequentNodeID) return subsequentNodeID;

  // there should only be one, since the invalid starting blocks cannot have in-ports
  const linkedNodeID = getLinkedNodeIDsByNodeID(nodeID)[0];
  const linkedNode = getNodeByID(linkedNodeID);
  const targetNodeID = linkedNode.combinedNodes[0] ?? linkedNode.id;

  const invalidBlockOutLinkID = getLinkIDsByNodeID(nodeID)[0];
  dispatch(updatePrototype({ activePathLinkIDs: [invalidBlockOutLinkID!] }));

  return targetNodeID;
};

const startPrototype =
  (diagramID?: string | null, nodeID?: string | null): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();

    const projectID = Session.activeProjectIDSelector(state);
    const variables = prototypeVariablesSelector(state);
    const activeDiagramID = Session.activeDiagramIDSelector(state);
    const linkIDsByNodeID = Creator.linkIDsByNodeIDSelector(state);
    const getLinkedNodeIDsByNodeID = Creator.linkedNodeIDsByNodeIDSelector(state);
    const nodeSelector = Creator.nodeByIDSelector(state);
    const targetNodeID = getValidStartingNode(nodeSelector, getLinkedNodeIDsByNodeID, linkIDsByNodeID, dispatch, nodeID) || undefined;
    const startNodeID = Creator.startNodeIDSelector(state);

    Errors.assertDiagramID(activeDiagramID);

    const context: Context = {
      stack: [
        {
          diagramID: diagramID || activeDiagramID,
          storage: {},
          variables: {},
          blockID: targetNodeID,
        },
      ],
      turn: {},
      trace: [],
      storage: {},
      variables,
    };

    localStorage.setItem(`TEST_VARIABLES_${projectID}`, JSON.stringify(variables));

    let prototypeStartNodeID = startNodeID;

    if (nodeID) {
      const parentNodeID = nodeSelector(nodeID).parentNode;
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
