import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, LINK, LINK_ID, MOCK_STATE, NODE_ID, PORT, PORT_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - removeDynamicPort reducer', ({ expect, describeReducerV2 }) => {
  describeReducerV2(Realtime.port.removeDynamic, ({ applyAction }) => {
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
      });

      expect(result).to.eq(MOCK_STATE);
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
        { ...ACTION_CONTEXT, nodeID: NODE_ID, portID: PORT_ID }
      );

      expect(result.ports).to.eql(normalize([fooPort, barPort]));
      expect(result.portsByNodeID).to.eql({
        [NODE_ID]: Realtime.Utils.port.createEmptyNodePorts(),
        fooNode: Realtime.Utils.port.createEmptyNodePorts(),
      });
      expect(result.nodeIDByPortID).to.eql({ [fooPort.id]: NODE_ID });
      expect(result.linkIDsByPortID).to.eql({ [fooPort.id]: ['fooLink'] });
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
                builtIn: {},
              },
            },
          },
        },
        { ...ACTION_CONTEXT, nodeID: NODE_ID, portID: PORT_ID }
      );

      expect(result.portsByNodeID[NODE_ID]).to.eql({
        in: [fooPort.id],
        out: {
          dynamic: [barPort.id],
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
        { ...ACTION_CONTEXT, nodeID: NODE_ID, portID: PORT_ID }
      );

      expect(result.links).to.eql(normalize([]));
      expect(result.nodeIDsByLinkID).to.eql({ [fooLink.id]: [NODE_ID] });
      expect(result.portIDsByLinkID).to.eql({ [barLink.id]: [PORT_ID] });
      expect(result.linkIDsByNodeID).to.eql({ [NODE_ID]: [fooLink.id, barLink.id] });
    });
  });
});
