import * as Realtime from '@voiceflow/realtime-sdk';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, MOCK_STATE, NODE_ID, PORT_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - addDynamicPort reducer', ({ describeReducerV2 }) => {
  describeReducerV2(Realtime.port.addDynamic, ({ applyAction, normalizeContaining }) => {
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
