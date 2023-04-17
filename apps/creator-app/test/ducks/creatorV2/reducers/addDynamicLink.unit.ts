import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, LINK_ID, MOCK_STATE, NODE_DATA, NODE_ID, PORT, PORT_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - addDynamicLink reducer', ({ describeReducerV2 }) => {
  describeReducerV2(Realtime.link.addDynamic, ({ applyAction, normalizeContaining }) => {
    const linkID = 'newLink';

    it('ignore adding a link for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        linkID,
        sourceNodeID: NODE_ID,
        sourcePortID: PORT_ID,
        targetNodeID: NODE_ID,
        targetPortID: PORT_ID,
        sourceParentNodeID: null,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('ignore adding a link with duplicate ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        linkID: LINK_ID,
        sourceNodeID: NODE_ID,
        sourcePortID: PORT_ID,
        targetNodeID: NODE_ID,
        targetPortID: PORT_ID,
        sourceParentNodeID: null,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('ignore adding a link with unrecognized source port ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        linkID,
        sourceNodeID: NODE_ID,
        sourcePortID: 'foo',
        targetNodeID: NODE_ID,
        targetPortID: PORT_ID,
        sourceParentNodeID: null,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('ignore adding a link with unrecognized target port ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        linkID,
        sourceNodeID: NODE_ID,
        sourcePortID: PORT_ID,
        targetNodeID: NODE_ID,
        targetPortID: 'foo',
        sourceParentNodeID: null,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('ignore adding a link with unrecognized source node ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        linkID,
        sourceNodeID: 'foo',
        sourcePortID: NODE_ID,
        targetNodeID: NODE_ID,
        targetPortID: PORT_ID,
        sourceParentNodeID: null,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('ignore adding a link with unrecognized target node ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        linkID,
        sourceNodeID: NODE_ID,
        sourcePortID: PORT_ID,
        targetNodeID: 'foo',
        targetPortID: PORT_ID,
        sourceParentNodeID: null,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('add link between ports', () => {
      const fooLinkID = 'fooLink';
      const barLinkID = 'barLink';
      const sourcePortID = 'sourcePort';
      const targetPortID = 'targetPort';
      const sourceNode = { ...NODE_DATA, nodeID: 'sourceNode' };
      const targetNode = { ...NODE_DATA, nodeID: 'targetNode' };

      const result = applyAction(
        {
          ...MOCK_STATE,
          nodes: normalize([sourceNode, targetNode], (node) => node.nodeID),
          ports: normalize([
            { ...PORT, id: sourcePortID },
            { ...PORT, id: targetPortID },
          ]),
          linkIDsByNodeID: {
            [sourceNode.nodeID]: [fooLinkID],
            [targetNode.nodeID]: [barLinkID],
          },
          linkIDsByPortID: {
            [sourcePortID]: [fooLinkID],
            [targetPortID]: [barLinkID],
          },
        },
        {
          ...ACTION_CONTEXT,
          linkID,
          sourceNodeID: sourceNode.nodeID,
          sourcePortID,
          targetNodeID: targetNode.nodeID,
          targetPortID,
          sourceParentNodeID: null,
        }
      );

      expect(result.links).toEqual(
        normalizeContaining([
          {
            id: linkID,
            source: { nodeID: sourceNode.nodeID, portID: sourcePortID },
            target: { nodeID: targetNode.nodeID, portID: targetPortID },
          },
        ])
      );
      expect(result.nodeIDsByLinkID).toEqual({ [linkID]: [sourceNode.nodeID, targetNode.nodeID] });
      expect(result.portIDsByLinkID).toEqual({ [linkID]: [sourcePortID, targetPortID] });
      expect(result.linkIDsByPortID).toEqual({
        [sourcePortID]: [fooLinkID, linkID],
        [targetPortID]: [barLinkID, linkID],
      });
      expect(result.linkIDsByNodeID).toEqual({
        [sourceNode.nodeID]: [fooLinkID, linkID],
        [targetNode.nodeID]: [barLinkID, linkID],
      });
    });
  });
});
