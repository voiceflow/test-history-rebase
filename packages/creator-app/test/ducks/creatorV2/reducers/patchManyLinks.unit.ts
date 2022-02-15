import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, LINK, MOCK_STATE } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - patchManyLinks reducer', ({ expect, describeReducerV2 }) => {
  describeReducerV2(Realtime.link.patchMany, ({ applyAction }) => {
    it('ignore patching links for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        patches: [],
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('patches multiple links', () => {
      const fooLink = { ...LINK, id: 'fooLink', data: { foo: 'bar' } as any };
      const barLink = { ...LINK, id: 'barLink', data: { fizz: 'buzz' } as any };

      const result = applyAction(
        {
          ...MOCK_STATE,
          links: Normal.normalize([LINK, fooLink, barLink]),
        },
        {
          ...ACTION_CONTEXT,
          patches: [
            { linkID: barLink.id, data: { fizz: 'buzz2', other: 'thing' } as any },
            { linkID: fooLink.id, data: { foo: 'bar2', another: 'thing' } as any },
          ],
        }
      );

      expect(Normal.getOne(result.links, fooLink.id)?.data).to.eql({ foo: 'bar2', another: 'thing' });
      expect(Normal.getOne(result.links, barLink.id)?.data).to.eql({ fizz: 'buzz2', other: 'thing' });
    });
  });
});
