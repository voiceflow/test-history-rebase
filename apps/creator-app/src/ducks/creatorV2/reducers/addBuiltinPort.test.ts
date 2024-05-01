import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { describe, expect, it } from 'vitest';

import { createDuckTools } from '@/ducks/_suite';
import * as CreatorV2 from '@/ducks/creatorV2';

import { ACTION_CONTEXT, MOCK_STATE, NODE_ID, PORT_ID } from '../creator.fixture';

const { describeReducer } = createDuckTools(CreatorV2, MOCK_STATE);

describe('Ducks | Creator V2 - addBuiltinPort reducer', () => {
  describeReducer(Realtime.port.addBuiltin, ({ applyAction, normalizeContaining }) => {
    it('ignore adding a built-in port for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        nodeID: NODE_ID,
        portID: PORT_ID,
        type: BaseModels.PortType.NO_MATCH,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('ignore adding a built-in port with duplicate ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        nodeID: NODE_ID,
        portID: PORT_ID,
        type: BaseModels.PortType.NO_MATCH,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('add built-in port', () => {
      const portID = 'builtInPort';
      const type = BaseModels.PortType.NO_MATCH;

      const result = applyAction(
        {
          ...MOCK_STATE,
          portsByNodeID: { [NODE_ID]: Realtime.Utils.port.createEmptyNodePorts() },
        },
        {
          ...ACTION_CONTEXT,
          nodeID: NODE_ID,
          portID,
          type,
        }
      );

      expect(result.ports).toEqual(normalizeContaining([{ id: portID, nodeID: NODE_ID, label: type }]));
      expect(result.portsByNodeID[NODE_ID]?.out.builtIn[type]).toBe(portID);
      expect(result.nodeIDByPortID).toEqual({ [portID]: NODE_ID });
      expect(result.linkIDsByPortID).toEqual({ [portID]: [] });
    });
  });
});
