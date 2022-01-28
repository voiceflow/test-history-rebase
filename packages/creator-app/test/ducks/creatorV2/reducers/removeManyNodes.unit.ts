import * as Realtime from '@realtime-sdk';
import { Models } from '@voiceflow/base-types';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';
import { createEmptyNodePorts } from '@/ducks/creatorV2/utils';

import suite from '../../_suite';
import { ACTION_CONTEXT, LINK, LINK_ID, MOCK_STATE, NODE_DATA, NODE_ID, PORT } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - removeManyNodes reducer', ({ expect, describeReducerV2 }) => {
  describeReducerV2(Realtime.node.removeMany, ({ applyAction }) => {
    it('ignore removing nodes for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        nodeIDs: [NODE_ID],
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('remove all references to a node', () => {
      const fooNode = { ...NODE_DATA, nodeID: 'fooNode' };
      const barNode = { ...NODE_DATA, nodeID: 'barNode' };

      const result = applyAction(
        {
          ...MOCK_STATE,
          nodes: normalize([fooNode, NODE_DATA, barNode], (node) => node.nodeID),
          portsByNodeID: {
            [fooNode.nodeID]: createEmptyNodePorts(),
            [barNode.nodeID]: createEmptyNodePorts(),
            [NODE_ID]: createEmptyNodePorts(),
          },
          stepIDsByBlockID: { [NODE_ID]: [], [fooNode.nodeID]: [barNode.nodeID] },
          blockIDByStepID: { [NODE_ID]: fooNode.nodeID, [barNode.nodeID]: fooNode.nodeID },
          originByNodeID: { [NODE_ID]: [-10, 10], [fooNode.nodeID]: [100, 200], [barNode.nodeID]: [123, 456] },
          linkIDsByNodeID: { [NODE_ID]: [LINK_ID], [fooNode.nodeID]: ['fooLink'], [barNode.nodeID]: ['barLink'] },
        },
        { ...ACTION_CONTEXT, nodeIDs: [NODE_ID] }
      );

      expect(result.nodes).to.eql(normalize([fooNode, barNode], (data) => data.nodeID));
      expect(result.portsByNodeID).to.eql({
        [fooNode.nodeID]: createEmptyNodePorts(),
        [barNode.nodeID]: createEmptyNodePorts(),
      });
      expect(result.stepIDsByBlockID).to.eql({ [fooNode.nodeID]: [barNode.nodeID] });
      expect(result.blockIDByStepID).to.eql({ [barNode.nodeID]: fooNode.nodeID });
      expect(result.originByNodeID).to.eql({ [fooNode.nodeID]: [100, 200], [barNode.nodeID]: [123, 456] });
      expect(result.linkIDsByNodeID).to.eql({ [fooNode.nodeID]: ['fooLink'], [barNode.nodeID]: ['barLink'] });
    });

    it('remove all references to a markup node', () => {
      const markupNode = { ...NODE_DATA, nodeID: 'markupNode' };
      const fooNode = { ...NODE_DATA, nodeID: 'fooNode' };

      const result = applyAction(
        {
          ...MOCK_STATE,
          markupIDs: [fooNode.nodeID, markupNode.nodeID],
        },
        { ...ACTION_CONTEXT, nodeIDs: [markupNode.nodeID] }
      );

      expect(result.markupIDs).to.eql([fooNode.nodeID]);
    });

    it('remove all references to a block node and all its steps', () => {
      const blockNode = { ...NODE_DATA, nodeID: 'blockNode' };
      const stepNode = { ...NODE_DATA, nodeID: 'stepNode' };
      const fooNode = { ...NODE_DATA, nodeID: 'fooNode' };

      const result = applyAction(
        {
          ...MOCK_STATE,
          nodes: normalize([stepNode, fooNode, blockNode], (node) => node.nodeID),
          blockIDs: [fooNode.nodeID, blockNode.nodeID],
          stepIDsByBlockID: { [blockNode.nodeID]: [stepNode.nodeID] },
        },
        { ...ACTION_CONTEXT, nodeIDs: [blockNode.nodeID] }
      );

      expect(result.nodes).to.eql(normalize([fooNode], (node) => node.nodeID));
      expect(result.blockIDs).to.eql([fooNode.nodeID]);
    });

    it('remove all references to a step node', () => {
      const blockNode = { ...NODE_DATA, nodeID: 'blockNode' };
      const stepNode = { ...NODE_DATA, nodeID: 'stepNode' };

      const result = applyAction(
        {
          ...MOCK_STATE,
          nodes: normalize([stepNode, blockNode], (node) => node.nodeID),
          stepIDsByBlockID: { [blockNode.nodeID]: [stepNode.nodeID, NODE_ID] },
          blockIDByStepID: { [stepNode.nodeID]: blockNode.nodeID },
        },
        { ...ACTION_CONTEXT, nodeIDs: [stepNode.nodeID] }
      );

      expect(result.nodes).to.eql(normalize([blockNode], (node) => node.nodeID));
      expect(result.stepIDsByBlockID).to.eql({ [blockNode.nodeID]: [NODE_ID] });
    });

    it('remove all ports and links from a node', () => {
      const blockNode = { ...NODE_DATA, nodeID: 'blockNode' };
      const stepNode = { ...NODE_DATA, nodeID: 'stepNode' };
      const fooPort = { ...PORT, id: 'fooPort' };
      const barPort = { ...PORT, id: 'barPort' };

      const result = applyAction(
        {
          ...MOCK_STATE,
          ports: normalize([fooPort, barPort]),
          links: normalize([LINK]),
          portsByNodeID: {
            [blockNode.nodeID]: {
              in: [],
              out: { dynamic: [fooPort.id], builtIn: {} },
            },
            [stepNode.nodeID]: {
              in: [],
              out: { dynamic: [], builtIn: { [Models.PortType.NEXT]: barPort.id } },
            },
          },
          nodeIDByPortID: { [fooPort.id]: blockNode.nodeID, [barPort.id]: stepNode.nodeID },
          stepIDsByBlockID: { [blockNode.nodeID]: [stepNode.nodeID] },
          linkIDsByPortID: { [fooPort.id]: [LINK_ID] },
        },
        { ...ACTION_CONTEXT, nodeIDs: [blockNode.nodeID] }
      );

      expect(result.ports).to.eql(normalize([]));
      expect(result.links).to.eql(normalize([]));
    });
  });
});
