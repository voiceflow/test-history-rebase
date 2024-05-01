import * as Realtime from '@voiceflow/realtime-sdk';
import { describe, expect, it } from 'vitest';

import { createDuckTools } from '@/ducks/_suite';

import * as CreatorV2 from '..';
import { ACTION_CONTEXT, MOCK_STATE, NODE_ID, PORT_ID } from '../creator.fixture';

const { describeReducer } = createDuckTools(CreatorV2, MOCK_STATE);

describe('Ducks | Creator V2 - addDynamicPort reducer', () => {
  describeReducer(Realtime.port.addDynamic, ({ applyAction, normalizeContaining }) => {
    it('ignore adding a dynamic port for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        nodeID: NODE_ID,
        portID: PORT_ID,
        label: 'my port',
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('ignore adding a dynamic port with duplicate ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        nodeID: NODE_ID,
        portID: PORT_ID,
        label: 'my port',
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('add dynamic port', () => {
      const portID = 'builtInPort';
      const label = 'my port';

      const result = applyAction(
        {
          ...MOCK_STATE,
          portsByNodeID: { [NODE_ID]: Realtime.Utils.port.createEmptyNodePorts() },
        },
        {
          ...ACTION_CONTEXT,
          nodeID: NODE_ID,
          portID,
          label,
        }
      );

      expect(result.ports).toEqual(normalizeContaining([{ id: portID, nodeID: NODE_ID, label }]));
      expect(result.portsByNodeID[NODE_ID]?.out.dynamic).toEqual([portID]);
      expect(result.nodeIDByPortID).toEqual({ [portID]: NODE_ID });
      expect(result.linkIDsByPortID).toEqual({ [portID]: [] });
    });
  });
});
