import * as Realtime from '@realtime-sdk';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, LINK, LINK_ID, MOCK_STATE, NODE_ID, PORT_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - removeLink reducer', ({ expect, describeReducerV2 }) => {
  describeReducerV2(Realtime.link.remove, ({ applyAction }) => {
    it('ignore removing link for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        linkID: LINK_ID,
      });

      expect(result).to.eq(MOCK_STATE);
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
        { ...ACTION_CONTEXT, linkID: LINK_ID }
      );

      expect(result.links).to.eql(normalize([fooLink, barLink]));
      expect(result.nodeIDsByLinkID).to.eql({ [fooLink.id]: [NODE_ID] });
      expect(result.portIDsByLinkID).to.eql({ [barLink.id]: [PORT_ID] });
      expect(result.linkIDsByNodeID).to.eql({ [NODE_ID]: [fooLink.id, barLink.id] });
      expect(result.linkIDsByPortID).to.eql({ [PORT_ID]: [fooLink.id, barLink.id] });
    });
  });
});
