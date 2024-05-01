import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';
import { describe, expect, it } from 'vitest';

import { createDuckTools } from '@/ducks/_suite';

import * as CreatorV2 from '..';
import { ACTION_CONTEXT, LINK, LINK_ID, MOCK_STATE, NODE_DATA, NODE_ID, PORT } from '../creator.fixture';

const { describeReducer } = createDuckTools(CreatorV2, MOCK_STATE);

describe('Ducks | Creator V2 - removeManyNodes reducer', () => {
  describeReducer(Realtime.node.removeMany, ({ applyAction }) => {
    it('ignore removing nodes for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        nodes: [{ parentNodeID: NODE_ID }],
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('remove all references to a node', () => {
      const fooNode = { ...NODE_DATA, nodeID: 'fooNode' };
      const barNode = { ...NODE_DATA, nodeID: 'barNode' };

      const result = applyAction(
        {
          ...MOCK_STATE,
          nodes: normalize([fooNode, NODE_DATA, barNode], (node) => node.nodeID),
          portsByNodeID: {
            [fooNode.nodeID]: Realtime.Utils.port.createEmptyNodePorts(),
            [barNode.nodeID]: Realtime.Utils.port.createEmptyNodePorts(),
            [NODE_ID]: Realtime.Utils.port.createEmptyNodePorts(),
          },
          stepIDsByParentNodeID: { [NODE_ID]: [], [fooNode.nodeID]: [barNode.nodeID] },
          parentNodeIDByStepID: { [NODE_ID]: fooNode.nodeID, [barNode.nodeID]: fooNode.nodeID },
          coordsByNodeID: { [NODE_ID]: [-10, 10], [fooNode.nodeID]: [100, 200], [barNode.nodeID]: [123, 456] },
          linkIDsByNodeID: { [NODE_ID]: [LINK_ID], [fooNode.nodeID]: ['fooLink'], [barNode.nodeID]: ['barLink'] },
        },
        { ...ACTION_CONTEXT, nodes: [{ parentNodeID: NODE_ID }] }
      );

      expect(result.nodes).toEqual(normalize([fooNode, barNode], (data) => data.nodeID));
      expect(result.portsByNodeID).toEqual({
        [fooNode.nodeID]: Realtime.Utils.port.createEmptyNodePorts(),
        [barNode.nodeID]: Realtime.Utils.port.createEmptyNodePorts(),
      });
      expect(result.stepIDsByParentNodeID).toEqual({ [fooNode.nodeID]: [barNode.nodeID] });
      expect(result.parentNodeIDByStepID).toEqual({ [barNode.nodeID]: fooNode.nodeID });
      expect(result.coordsByNodeID).toEqual({ [fooNode.nodeID]: [100, 200], [barNode.nodeID]: [123, 456] });
      expect(result.linkIDsByNodeID).toEqual({ [fooNode.nodeID]: ['fooLink'], [barNode.nodeID]: ['barLink'] });
    });

    it('remove all references to a markup node', () => {
      const markupNode = { ...NODE_DATA, nodeID: 'markupNode' };
      const fooNode = { ...NODE_DATA, nodeID: 'fooNode' };

      const result = applyAction(
        {
          ...MOCK_STATE,
          markupIDs: [fooNode.nodeID, markupNode.nodeID],
        },
        { ...ACTION_CONTEXT, nodes: [{ parentNodeID: markupNode.nodeID }] }
      );

      expect(result.markupIDs).toEqual([fooNode.nodeID]);
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
          stepIDsByParentNodeID: { [blockNode.nodeID]: [stepNode.nodeID] },
        },
        { ...ACTION_CONTEXT, nodes: [{ parentNodeID: blockNode.nodeID }] }
      );

      expect(result.nodes).toEqual(normalize([fooNode], (node) => node.nodeID));
      expect(result.blockIDs).toEqual([fooNode.nodeID]);
    });

    it('remove all references to a step node', () => {
      const blockNode = { ...NODE_DATA, nodeID: 'blockNode' };
      const stepNode = { ...NODE_DATA, nodeID: 'stepNode' };

      const result = applyAction(
        {
          ...MOCK_STATE,
          nodes: normalize([stepNode, blockNode], (node) => node.nodeID),
          stepIDsByParentNodeID: { [blockNode.nodeID]: [stepNode.nodeID, NODE_ID] },
          parentNodeIDByStepID: { [stepNode.nodeID]: blockNode.nodeID },
        },
        { ...ACTION_CONTEXT, nodes: [{ parentNodeID: blockNode.nodeID, stepID: stepNode.nodeID }] }
      );

      expect(result.nodes).toEqual(normalize([blockNode], (node) => node.nodeID));
      expect(result.stepIDsByParentNodeID).toEqual({ [blockNode.nodeID]: [NODE_ID] });
    });

    it('remove all ports and links from a node', () => {
      const blockNode = { ...NODE_DATA, nodeID: 'blockNode' };
      const stepNode = { ...NODE_DATA, nodeID: 'stepNode' };
      const byKeyPort = { ...PORT, id: 'byKeyPort' };
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
              out: { dynamic: [fooPort.id], builtIn: {}, byKey: { byKeyPortKey: byKeyPort.id } },
            },
            [stepNode.nodeID]: {
              in: [],
              out: { dynamic: [], builtIn: { [BaseModels.PortType.NEXT]: barPort.id }, byKey: {} },
            },
          },
          nodeIDByPortID: { [fooPort.id]: blockNode.nodeID, [barPort.id]: stepNode.nodeID },
          stepIDsByParentNodeID: { [blockNode.nodeID]: [stepNode.nodeID] },
          linkIDsByPortID: { [fooPort.id]: [LINK_ID] },
        },
        { ...ACTION_CONTEXT, nodes: [{ parentNodeID: blockNode.nodeID }] }
      );

      expect(result.ports).toEqual(normalize([]));
      expect(result.links).toEqual(normalize([]));
    });
  });
});
