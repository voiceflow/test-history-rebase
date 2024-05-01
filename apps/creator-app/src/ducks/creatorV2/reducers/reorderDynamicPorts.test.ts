import * as Realtime from '@voiceflow/realtime-sdk';
import { describe, expect, it } from 'vitest';

import { createDuckTools } from '@/ducks/_suite';

import * as CreatorV2 from '..';
import { ACTION_CONTEXT, MOCK_STATE, NODE_ID, PORT_ID } from '../creator.fixture';

const { createState, describeReducer, describeReverter } = createDuckTools(CreatorV2, MOCK_STATE);

describe('Ducks | Creator V2 - reorderDynamicPorts reducer', () => {
  describeReducer(Realtime.port.reorderDynamic, ({ applyAction }) => {
    it('ignore reordering ports for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        nodeID: NODE_ID,
        portID: PORT_ID,
        index: 1,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('ignore reordering port with unrecognized ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        nodeID: NODE_ID,
        portID: 'foo',
        index: 1,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('ignore reordering port that does not exist on node', () => {
      const initialState = {
        ...MOCK_STATE,
        portsByNodeID: {
          [NODE_ID]: {
            in: [],
            out: {
              dynamic: ['foo', 'bar', 'fizz'],
              byKey: {},
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

      expect(result).toBe(initialState);
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
                byKey: {},
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

      expect(result.portsByNodeID[NODE_ID]?.out.dynamic).toEqual(['foo', PORT_ID, 'bar', 'fizz']);
    });
  });

  describeReverter(Realtime.port.reorderDynamic, ({ revertAction }) => {
    it('registers an action reverter', () => {
      const rootState = createState({
        ...MOCK_STATE,
        portsByNodeID: {
          [NODE_ID]: { in: [], out: { builtIn: {}, byKey: {}, dynamic: ['first', PORT_ID, 'third', 'fourth'] } },
        },
      });

      const result = revertAction(rootState, { ...ACTION_CONTEXT, nodeID: NODE_ID, portID: PORT_ID, index: 2 });

      expect(result).toEqual(
        Realtime.port.reorderDynamic({ ...ACTION_CONTEXT, nodeID: NODE_ID, portID: PORT_ID, index: 1 })
      );
    });
  });
});
