import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, LINK, LINK_ID, MOCK_STATE, NODE_ID, PORT_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - removeManyLinks reducer', ({ describeReducerV2 }) => {
  describeReducerV2(Realtime.link.removeMany, ({ applyAction }) => {
    it('ignore removing link for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        links: [{ nodeID: NODE_ID, portID: PORT_ID, linkID: LINK_ID }],
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('remove a link with all references', () => {
      const fooLink = { ...LINK, id: 'fooLink' };
      const barLink = { ...LINK, id: 'barLink' };

      const result = applyAction(
        {
          ...MOCK_STATE,
          links: normalize([LINK, fooLink, barLink]),
          nodeIDsByLinkID: { [LINK_ID]: [NODE_ID], [fooLink.id]: [NODE_ID] },
          portIDsByLinkID: { [LINK_ID]: [PORT_ID], [barLink.id]: [PORT_ID] },
          linkIDsByNodeID: { [NODE_ID]: [fooLink.id, LINK_ID, barLink.id] },
          linkIDsByPortID: { [PORT_ID]: [fooLink.id, LINK_ID, barLink.id] },
        },
        { ...ACTION_CONTEXT, links: [{ nodeID: NODE_ID, portID: PORT_ID, linkID: LINK_ID }] }
      );

      expect(result.links).toEqual(normalize([fooLink, barLink]));
      expect(result.nodeIDsByLinkID).toEqual({ [fooLink.id]: [NODE_ID] });
      expect(result.portIDsByLinkID).toEqual({ [barLink.id]: [PORT_ID] });
      expect(result.linkIDsByNodeID).toEqual({ [NODE_ID]: [fooLink.id, barLink.id] });
      expect(result.linkIDsByPortID).toEqual({ [PORT_ID]: [fooLink.id, barLink.id] });
    });

    it('removes multiple links', () => {
      const fooLink = { ...LINK, id: 'fooLink' };
      const barLink = { ...LINK, id: 'barLink' };

      const result = applyAction(
        {
          ...MOCK_STATE,
          links: normalize([LINK, fooLink, barLink]),
          nodeIDsByLinkID: { [LINK_ID]: [NODE_ID], [fooLink.id]: [NODE_ID] },
          portIDsByLinkID: { [LINK_ID]: [PORT_ID], [barLink.id]: [PORT_ID], [fooLink.id]: [PORT_ID] },
          linkIDsByNodeID: { [NODE_ID]: [fooLink.id, LINK_ID, barLink.id] },
          linkIDsByPortID: { [PORT_ID]: [fooLink.id, LINK_ID, barLink.id] },
        },
        {
          ...ACTION_CONTEXT,
          links: [
            { nodeID: NODE_ID, portID: PORT_ID, linkID: LINK_ID },
            { nodeID: NODE_ID, portID: PORT_ID, linkID: fooLink.id },
          ],
        }
      );

      expect(result.links).toEqual(normalize([barLink]));
      expect(result.nodeIDsByLinkID).toEqual({});
      expect(result.portIDsByLinkID).toEqual({ [barLink.id]: [PORT_ID] });
      expect(result.linkIDsByNodeID).toEqual({ [NODE_ID]: [barLink.id] });
      expect(result.linkIDsByPortID).toEqual({ [PORT_ID]: [barLink.id] });
    });
  });
});
