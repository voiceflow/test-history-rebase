import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';
import { describe, expect, it } from 'vitest';

import { createDuckTools } from '@/ducks/_suite';

import * as CreatorV2 from '..';
import { ACTION_CONTEXT, LINK, LINK_ID, MOCK_STATE, NODE_ID, PORT, PORT_ID } from '../creator.fixture';

const { createState, describeReducer, describeReverter } = createDuckTools(CreatorV2, MOCK_STATE);

describe('Ducks | Creator V2 - removeDynamicPort reducer', () => {
  describeReducer(Realtime.port.removeDynamic, ({ applyAction }) => {
    const fooLink = { ...LINK, id: 'fooLink' };
    const barLink = { ...LINK, id: 'barLink' };
    const fooPort = { ...PORT, id: 'fooPort' };
    const barPort = { ...PORT, id: 'barPort' };

    it('ignore removing port for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        nodeID: NODE_ID,
        portID: PORT_ID,
        removeNodes: [],
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('remove all references to a port', () => {
      const result = applyAction(
        {
          ...MOCK_STATE,
          ports: normalize([fooPort, PORT, barPort]),
          portsByNodeID: {
            [NODE_ID]: Realtime.Utils.port.createEmptyNodePorts(),
            fooNode: Realtime.Utils.port.createEmptyNodePorts(),
          },
          nodeIDByPortID: { [PORT_ID]: NODE_ID, [fooPort.id]: NODE_ID },
          linkIDsByPortID: { [PORT_ID]: [], [fooPort.id]: ['fooLink'] },
        },
        { ...ACTION_CONTEXT, nodeID: NODE_ID, portID: PORT_ID, removeNodes: [] }
      );

      expect(result.ports).toEqual(normalize([fooPort, barPort]));
      expect(result.portsByNodeID).toEqual({
        [NODE_ID]: Realtime.Utils.port.createEmptyNodePorts(),
        fooNode: Realtime.Utils.port.createEmptyNodePorts(),
      });
      expect(result.nodeIDByPortID).toEqual({ [fooPort.id]: NODE_ID });
      expect(result.linkIDsByPortID).toEqual({ [fooPort.id]: ['fooLink'] });
    });

    it('remove a dynamic port', () => {
      const result = applyAction(
        {
          ...MOCK_STATE,
          portsByNodeID: {
            [NODE_ID]: {
              in: [fooPort.id],
              out: {
                dynamic: [barPort.id, PORT_ID],
                byKey: {},
                builtIn: {},
              },
            },
          },
        },
        { ...ACTION_CONTEXT, nodeID: NODE_ID, portID: PORT_ID, removeNodes: [] }
      );

      expect(result.portsByNodeID[NODE_ID]).toEqual({
        in: [fooPort.id],
        out: {
          dynamic: [barPort.id],
          byKey: {},
          builtIn: {},
        },
      });
    });

    it('remove all links from a port', () => {
      const result = applyAction(
        {
          ...MOCK_STATE,
          links: normalize([LINK]),
          nodeIDsByLinkID: { [LINK_ID]: [NODE_ID], [fooLink.id]: [NODE_ID] },
          portIDsByLinkID: { [LINK_ID]: [PORT_ID], [barLink.id]: [PORT_ID] },
          linkIDsByNodeID: { [NODE_ID]: [fooLink.id, LINK_ID, barLink.id] },
          linkIDsByPortID: { [PORT_ID]: [LINK_ID] },
        },
        { ...ACTION_CONTEXT, nodeID: NODE_ID, portID: PORT_ID, removeNodes: [] }
      );

      expect(result.links).toEqual(normalize([]));
      expect(result.nodeIDsByLinkID).toEqual({ [fooLink.id]: [NODE_ID] });
      expect(result.portIDsByLinkID).toEqual({ [barLink.id]: [PORT_ID] });
      expect(result.linkIDsByNodeID).toEqual({ [NODE_ID]: [fooLink.id, barLink.id] });
    });
  });

  describeReverter(Realtime.port.removeDynamic, ({ revertAction }) => {
    it('registers an action reverter', () => {
      const targetNodeID = 'targetNodeID';
      const targetPortID = 'targetPortID';
      const portLabel = 'my port';
      const linkData: any = { foo: 'bar' };
      const rootState = createState({
        ...MOCK_STATE,
        linkIDsByPortID: { [PORT_ID]: [LINK_ID] },
        portsByNodeID: {
          [NODE_ID]: { in: [], out: { byKey: {}, builtIn: {}, dynamic: ['first', 'second', PORT_ID, 'fourth'] } },
        },
        ports: normalize([{ id: PORT_ID, nodeID: NODE_ID, label: portLabel, virtual: false }]),
        links: normalize([
          {
            id: LINK_ID,
            source: { nodeID: NODE_ID, portID: PORT_ID },
            target: { nodeID: targetNodeID, portID: targetPortID },
            data: linkData,
          },
        ]),
      });

      const result = revertAction(rootState, {
        ...ACTION_CONTEXT,
        nodeID: NODE_ID,
        portID: PORT_ID,
        removeNodes: [],
      });

      expect(result).toEqual([
        Realtime.port.addDynamic({
          ...ACTION_CONTEXT,
          nodeID: NODE_ID,
          portID: PORT_ID,
          index: 2,
          label: portLabel,
        }),
        Realtime.link.addDynamic({
          ...ACTION_CONTEXT,
          sourceParentNodeID: null,
          sourceNodeID: NODE_ID,
          sourcePortID: PORT_ID,
          targetNodeID,
          targetPortID,
          linkID: LINK_ID,
          data: linkData,
        }),
      ]);
    });
  });
});
