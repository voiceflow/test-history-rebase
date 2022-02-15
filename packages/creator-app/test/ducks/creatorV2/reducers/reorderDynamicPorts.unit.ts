import * as Realtime from '@voiceflow/realtime-sdk';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, MOCK_STATE, NODE_ID, PORT_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - reorderDynamicPorts reducer', ({ expect, describeReducerV2 }) => {
  describeReducerV2(Realtime.port.reorderDynamic, ({ applyAction }) => {
    it('ignore reordering ports for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        nodeID: NODE_ID,
        portID: PORT_ID,
        index: 1,
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore reordering port with unrecognized ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        nodeID: NODE_ID,
        portID: 'foo',
        index: 1,
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore reordering port that does not exist on node', () => {
      const initialState = {
        ...MOCK_STATE,
        portsByNodeID: {
          [NODE_ID]: {
            in: [],
            out: {
              dynamic: ['foo', 'bar', 'fizz'],
              builtIn: {},
            },
          },
        },
      };

      const result = applyAction(initialState, {
        ...ACTION_CONTEXT,
        nodeID: NODE_ID,
        portID: PORT_ID,
        index: 2,
      });

      expect(result).to.eq(initialState);
    });

    it('reorder an existing dynamic port', () => {
      const result = applyAction(
        {
          ...MOCK_STATE,
          portsByNodeID: {
            [NODE_ID]: {
              in: [],
              out: {
                dynamic: ['foo', 'bar', PORT_ID, 'fizz'],
                builtIn: {},
              },
            },
          },
        },
        {
          ...ACTION_CONTEXT,
          nodeID: NODE_ID,
          portID: PORT_ID,
          index: 1,
        }
      );

      expect(result.portsByNodeID[NODE_ID]?.out.dynamic).to.eql(['foo', PORT_ID, 'bar', 'fizz']);
    });
  });
});
