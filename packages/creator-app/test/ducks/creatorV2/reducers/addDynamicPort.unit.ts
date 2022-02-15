import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';
import { createEmptyNodePorts } from '@/ducks/creatorV2/utils';

import suite from '../../_suite';
import { ACTION_CONTEXT, MOCK_STATE, NODE_ID, PORT_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - addDynamicPort reducer', ({ expect, describeReducerV2 }) => {
  describeReducerV2(Realtime.port.addDynamic, ({ applyAction }) => {
    it('ignore adding a dynamic port for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        nodeID: NODE_ID,
        portID: PORT_ID,
        label: 'my port',
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore adding a dynamic port with duplicate ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        nodeID: NODE_ID,
        portID: PORT_ID,
        label: 'my port',
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('add dynamic port', () => {
      const portID = 'builtInPort';
      const label = 'my port';

      const result = applyAction(
        {
          ...MOCK_STATE,
          portsByNodeID: { [NODE_ID]: createEmptyNodePorts() },
        },
        {
          ...ACTION_CONTEXT,
          nodeID: NODE_ID,
          portID,
          label,
        }
      );

      expect(result.ports).to.containSubset(normalize([{ id: portID, nodeID: NODE_ID, label, virtual: false }]));
      expect(result.portsByNodeID[NODE_ID]?.out.dynamic).to.eql([portID]);
      expect(result.nodeIDByPortID).to.eql({ [portID]: NODE_ID });
      expect(result.linkIDsByPortID).to.eql({ [portID]: [] });
    });
  });
});
