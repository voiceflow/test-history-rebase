import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, LINK, MOCK_STATE, NODE_ID, PORT_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)(
  'Ducks | Creator V2 - patchManyLinks reducer',
  ({ describeReducerV2, describeReverter, createState }) => {
    describeReducerV2(Realtime.link.patchMany, ({ applyAction }) => {
      it('ignore patching links for a different diagram', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          diagramID: 'foo',
          patches: [],
        });

        expect(result).toBe(MOCK_STATE);
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
              { nodeID: NODE_ID, portID: PORT_ID, linkID: barLink.id, data: { fizz: 'buzz2', other: 'thing' } as any },
              { nodeID: NODE_ID, portID: PORT_ID, linkID: fooLink.id, data: { foo: 'bar2', another: 'thing' } as any },
            ],
          }
        );

        expect(Normal.getOne(result.links, fooLink.id)?.data).toEqual({ foo: 'bar2', another: 'thing' });
        expect(Normal.getOne(result.links, barLink.id)?.data).toEqual({ fizz: 'buzz2', other: 'thing' });
      });
    });

    describeReverter(Realtime.link.patchMany, ({ revertAction }) => {
      it('registers an action reverter', () => {
        const fooLink = 'fooLinkID';
        const fooData: any = { foo: 'bar' };
        const barLink = 'barLinkID';
        const barData: any = { bar: 'foo' };
        const rootState = createState({
          ...MOCK_STATE,
          links: Normal.normalize([
            {
              id: fooLink,
              source: { nodeID: NODE_ID, portID: PORT_ID },
              target: { nodeID: 'fooNodeID', portID: 'fooPortID' },
              data: fooData,
            },
            {
              id: barLink,
              source: { nodeID: NODE_ID, portID: PORT_ID },
              target: { nodeID: 'barNodeID', portID: 'barPortID' },
              data: barData,
            },
          ]),
        });

        const result = revertAction(rootState, {
          ...ACTION_CONTEXT,
          patches: [
            { nodeID: NODE_ID, portID: PORT_ID, linkID: fooLink, data: { fizz: 'buzz' } as any },
            { nodeID: NODE_ID, portID: PORT_ID, linkID: barLink, data: { buzz: 'fizz' } as any },
          ],
        });

        expect(result).toEqual(
          Realtime.link.patchMany({
            ...ACTION_CONTEXT,
            patches: [
              { nodeID: NODE_ID, portID: PORT_ID, linkID: fooLink, data: fooData },
              { nodeID: NODE_ID, portID: PORT_ID, linkID: barLink, data: barData },
            ],
          })
        );
      });
    });
  }
);
