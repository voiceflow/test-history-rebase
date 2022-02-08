import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, LINK_ID, MOCK_STATE, NODE_DATA, PORT, PORT_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - addLink reducer', ({ expect, describeReducerV2 }) => {
  describeReducerV2(Realtime.link.add, ({ applyAction }) => {
    const linkID = 'newLink';
    const sourcePortID = 'sourcePort';
    const targetPortID = 'targetPort';

    it('ignore adding a link for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        linkID,
        sourcePortID,
        targetPortID,
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore adding a link with duplicate ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        linkID: LINK_ID,
        sourcePortID,
        targetPortID,
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore adding a link with unrecognized source port ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        linkID,
        sourcePortID,
        targetPortID: PORT_ID,
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore adding a link with unrecognized target port ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        linkID,
        sourcePortID: PORT_ID,
        targetPortID,
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('add link between ports', () => {
      const fooLinkID = 'fooLink';
      const barLinkID = 'barLink';
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
          nodeIDByPortID: {
            [sourcePortID]: sourceNode.nodeID,
            [targetPortID]: targetNode.nodeID,
          },
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
          sourcePortID,
          targetPortID,
        }
      );

      expect(result.links).to.containSubset(
        normalize([
          {
            id: linkID,
            source: { nodeID: sourceNode.nodeID, portID: sourcePortID },
            target: { nodeID: targetNode.nodeID, portID: targetPortID },
          },
        ])
      );
      expect(result.nodeIDsByLinkID).to.eql({ [linkID]: [sourceNode.nodeID, targetNode.nodeID] });
      expect(result.portIDsByLinkID).to.eql({ [linkID]: [sourcePortID, targetPortID] });
      expect(result.linkIDsByPortID).to.eql({
        [sourcePortID]: [fooLinkID, linkID],
        [targetPortID]: [barLinkID, linkID],
      });
      expect(result.linkIDsByNodeID).to.eql({
        [sourceNode.nodeID]: [fooLinkID, linkID],
        [targetNode.nodeID]: [barLinkID, linkID],
      });
    });
  });
});
