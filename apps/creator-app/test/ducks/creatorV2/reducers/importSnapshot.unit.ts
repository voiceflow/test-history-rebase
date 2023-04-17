import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, LINK, MOCK_STATE, NODE, NODE_DATA, NODE_ID, PORT, PORT_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - importSnapshot reducer', ({ describeReducerV2 }) => {
  describeReducerV2(Realtime.creator.importSnapshot, ({ applyAction }) => {
    interface NodeTupleOptions<T> {
      type: Realtime.BlockType;
      id?: string;
      parentID?: string | null;
      data?: Partial<T>;
    }

    const createNodeTuple = <T extends object>({ type, id = NODE_ID, data = {} }: NodeTupleOptions<T>) =>
      [
        { ...NODE, id, type },
        { ...NODE_DATA, ...data, nodeID: id, type },
      ] as const;

    const createPort = ({ id = PORT_ID }: { id?: string } = {}) => ({ ...PORT, id });

    it('register a markup node', () => {
      const [node, data] = createNodeTuple({ id: 'markupID', type: Realtime.BlockType.MARKUP_TEXT });

      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        nodesWithData: [{ node, data }],
        ports: [],
        links: [],
        projectMeta: {
          platform: Platform.Constants.PlatformType.ALEXA,
          type: Platform.Constants.ProjectType.VOICE,
        },
        schemaVersion: 1,
      });

      expect(result.markupIDs).toEqual([node.id]);
      expect(result.nodes).toEqual(normalize([NODE_DATA, data], (data) => data.nodeID));
      expect(result.coordsByNodeID).toEqual({ [node.id]: [node.x, node.y] });
    });

    it('register blocks and steps', () => {
      const [blockNode, blockData] = createNodeTuple({ id: 'blockID', type: Realtime.BlockType.COMBINED });
      const [stepNode, stepData] = createNodeTuple({ id: 'stepID', type: Realtime.BlockType.SPEAK });

      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        nodesWithData: [
          { node: { ...blockNode, combinedNodes: [stepNode.id] }, data: blockData },
          { node: { ...stepNode, parentNode: blockNode.id }, data: stepData },
        ],
        ports: [],
        links: [],
        projectMeta: {
          platform: Platform.Constants.PlatformType.ALEXA,
          type: Platform.Constants.ProjectType.VOICE,
        },
        schemaVersion: 1,
      });

      expect(result.blockIDs).toEqual([blockNode.id]);
      expect(result.nodes).toEqual(normalize([NODE_DATA, blockData, stepData], (data) => data.nodeID));
      expect(result.coordsByNodeID).toEqual({ [blockNode.id]: [blockNode.x, blockNode.y] });
      expect(result.stepIDsByParentNodeID).toEqual({ [blockNode.id]: [stepNode.id] });
      expect(result.parentNodeIDByStepID).toEqual({ [stepNode.id]: blockNode.id });
      expect(result.portsByNodeID).toEqual({ [blockNode.id]: blockNode.ports, [stepNode.id]: stepNode.ports });
      expect(result.linkIDsByNodeID).toEqual({ [blockNode.id]: [], [stepNode.id]: [] });
    });

    it('register a port', () => {
      const port = createPort({ id: 'foo' });

      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        nodesWithData: [],
        ports: [port],
        links: [],
        projectMeta: {
          platform: Platform.Constants.PlatformType.ALEXA,
          type: Platform.Constants.ProjectType.VOICE,
        },
        schemaVersion: 1,
      });

      expect(result.ports).toEqual(normalize([PORT, port]));
    });

    it('register a link between nodes', () => {
      const [node1, data1] = createNodeTuple({ id: 'blockID', type: Realtime.BlockType.CARD });
      const [node2, data2] = createNodeTuple({ id: 'stepID', type: Realtime.BlockType.SPEAK });
      const port1 = createPort({ id: 'port1' });
      const port2 = createPort({ id: 'port2' });
      const link: Realtime.Link = {
        id: 'foo',
        source: { nodeID: node1.id, portID: port1.id },
        target: { nodeID: node2.id, portID: port2.id },
      };

      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        nodesWithData: [
          { node: node1, data: data1 },
          { node: node2, data: data2 },
        ],
        ports: [port1, port2],
        links: [link],
        projectMeta: {
          platform: Platform.Constants.PlatformType.ALEXA,
          type: Platform.Constants.ProjectType.VOICE,
        },
        schemaVersion: 1,
      });

      expect(result.links).toEqual(normalize([LINK, link]));
      expect(result.nodeIDsByLinkID).toEqual({ [link.id]: [node1.id, node2.id] });
      expect(result.portIDsByLinkID).toEqual({ [link.id]: [port1.id, port2.id] });
      expect(result.linkIDsByNodeID).toEqual({ [node1.id]: [link.id], [node2.id]: [link.id] });
      expect(result.linkIDsByPortID).toEqual({ [port1.id]: [link.id], [port2.id]: [link.id] });
    });
  });
});
