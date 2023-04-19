import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, LINK, LINK_ID, MOCK_STATE, NODE_ID, PORT, PORT_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - removeBuiltinPort reducer', ({ describeReducerV2, describeReverter, createState }) => {
  describeReducerV2(Realtime.port.removeBuiltin, ({ applyAction }) => {
    const fooLink = { ...LINK, id: 'fooLink' };
    const barLink = { ...LINK, id: 'barLink' };
    const fooPort = { ...PORT, id: 'fooPort' };
    const barPort = { ...PORT, id: 'barPort' };
    const portType = BaseModels.PortType.NO_REPLY;

    it('ignore removing port for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        nodeID: NODE_ID,
        portID: PORT_ID,
        type: portType,
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
        {
          ...ACTION_CONTEXT,
          nodeID: NODE_ID,
          portID: PORT_ID,
          type: portType,
          removeNodes: [],
        }
      );

      expect(result.ports).toEqual(normalize([fooPort, barPort]));
      expect(result.portsByNodeID).toEqual({
        [NODE_ID]: Realtime.Utils.port.createEmptyNodePorts(),
        fooNode: Realtime.Utils.port.createEmptyNodePorts(),
      });
      expect(result.nodeIDByPortID).toEqual({ [fooPort.id]: NODE_ID });
      expect(result.linkIDsByPortID).toEqual({ [fooPort.id]: ['fooLink'] });
    });

    it('remove a built-in port', () => {
      const result = applyAction(
        {
          ...MOCK_STATE,
          portsByNodeID: {
            [NODE_ID]: {
              in: [fooPort.id],
              out: {
                dynamic: [],
                byKey: {},
                builtIn: {
                  [BaseModels.PortType.FAIL]: barPort.id,
                  [BaseModels.PortType.NEXT]: PORT_ID,
                },
              },
            },
          },
        },
        {
          ...ACTION_CONTEXT,
          nodeID: NODE_ID,
          portID: PORT_ID,
          type: portType,
          removeNodes: [],
        }
      );

      expect(result.portsByNodeID[NODE_ID]).toEqual({
        in: [fooPort.id],
        out: {
          dynamic: [],
          byKey: {},
          builtIn: {
            [BaseModels.PortType.FAIL]: barPort.id,
          },
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
        {
          ...ACTION_CONTEXT,
          nodeID: NODE_ID,
          portID: PORT_ID,
          type: portType,
          removeNodes: [],
        }
      );

      expect(result.links).toEqual(normalize([]));
      expect(result.nodeIDsByLinkID).toEqual({ [fooLink.id]: [NODE_ID] });
      expect(result.portIDsByLinkID).toEqual({ [barLink.id]: [PORT_ID] });
      expect(result.linkIDsByNodeID).toEqual({ [NODE_ID]: [fooLink.id, barLink.id] });
    });
  });

  describeReverter(Realtime.port.removeBuiltin, ({ revertAction }) => {
    it('registers an action reverter', () => {
      const type = BaseModels.PortType.NEXT;
      const targetNodeID = 'targetNodeID';
      const targetPortID = 'targetPortID';
      const linkData: any = { foo: 'bar' };
      const rootState = createState({
        ...MOCK_STATE,
        linkIDsByPortID: { [PORT_ID]: [LINK_ID] },
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
        type,
        removeNodes: [],
      });

      expect(result).toEqual([
        Realtime.port.addBuiltin({
          ...ACTION_CONTEXT,
          nodeID: NODE_ID,
          portID: PORT_ID,
          type,
        }),
        Realtime.link.addBuiltin({
          ...ACTION_CONTEXT,
          sourceParentNodeID: null,
          sourceNodeID: NODE_ID,
          sourcePortID: PORT_ID,
          targetNodeID,
          targetPortID,
          linkID: LINK_ID,
          data: linkData,
          type,
        }),
      ]);
    });
  });
});
