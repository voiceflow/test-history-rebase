import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, MOCK_STATE, NODE_ID, PROJECT_META, SCHEMA_VERSION } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - addBlock reducer', ({ describeReducerV2 }) => {
  describeReducerV2(Realtime.node.addBlock, ({ applyAction, normalizeContaining }) => {
    const blockID = 'blockNode';
    const stepID = 'stepNode';
    const blockName = 'New Block';
    const blockColor = '#ff0000';
    const blockCoords: Realtime.Point = [100, 200];
    const stepData = { type: Realtime.BlockType.BUTTONS, name: 'node name' };

    it('ignore adding a block for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        schemaVersion: SCHEMA_VERSION,
        projectMeta: PROJECT_META,
        diagramID: 'foo',
        blockID,
        stepID,
        blockCoords,
        blockName,
        blockPorts: Realtime.Utils.port.createEmptyNodePorts(),
        stepPorts: Realtime.Utils.port.createEmptyNodePorts(),
        stepData,
      });

      expect(result).toBe(MOCK_STATE);
    });

    it('ignore adding block with duplicate ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        schemaVersion: SCHEMA_VERSION,
        projectMeta: PROJECT_META,
        blockID: NODE_ID,
        stepID,
        blockCoords,
        blockName,
        blockPorts: Realtime.Utils.port.createEmptyNodePorts(),
        stepPorts: Realtime.Utils.port.createEmptyNodePorts(),
        stepData,
      });

      expect(result).toEqual(MOCK_STATE);
    });

    it('ignore adding step with duplicate ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        schemaVersion: SCHEMA_VERSION,
        projectMeta: PROJECT_META,
        blockID,
        stepID: NODE_ID,
        blockCoords,
        blockName,
        blockPorts: Realtime.Utils.port.createEmptyNodePorts(),
        stepPorts: Realtime.Utils.port.createEmptyNodePorts(),
        stepData,
      });

      expect(result).toEqual(MOCK_STATE);
    });

    it('add a block and step', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        schemaVersion: SCHEMA_VERSION,
        projectMeta: PROJECT_META,
        blockID,
        stepID,
        blockCoords,
        blockName,
        blockColor,
        blockPorts: Realtime.Utils.port.createEmptyNodePorts(),
        stepPorts: Realtime.Utils.port.createEmptyNodePorts(),
        stepData,
      });

      expect(result.nodes).toEqual(
        normalizeContaining(
          [
            { type: Realtime.BlockType.COMBINED, blockColor: '#ff0000', nodeID: blockID, name: blockName },
            { ...stepData, nodeID: stepID },
          ],
          (node) => node.nodeID
        )
      );
      expect(result.blockIDs).toEqual([blockID]);
      expect(result.coordsByNodeID).toEqual({ [blockID]: blockCoords });
      expect(result.stepIDsByParentNodeID).toEqual({ [blockID]: [stepID] });
      expect(result.parentNodeIDByStepID).toEqual({ [stepID]: blockID });
      expect(result.portsByNodeID).toEqual({
        [blockID]: Realtime.Utils.port.createEmptyNodePorts(),
        [stepID]: Realtime.Utils.port.createEmptyNodePorts(),
      });
      expect(result.linkIDsByNodeID).toEqual({ [blockID]: [], [stepID]: [] });
    });

    it('register all ports of an added block and step', () => {
      const inPortID = 'inPort';
      const byKeyPortKey = 'byKeyPortKey';
      const byKeyPortID = 'byKeyPort';
      const dynamicPortID = 'dynamicPort';
      const builtInPortID = 'builtInPort';

      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        schemaVersion: SCHEMA_VERSION,
        projectMeta: PROJECT_META,
        blockID,
        stepID,
        blockCoords,
        blockName: 'New Block',
        stepData,
        blockPorts: {
          in: [{ id: inPortID }],
          out: { byKey: {}, dynamic: [], builtIn: {} },
        },
        stepPorts: {
          in: [],
          out: {
            byKey: {
              [byKeyPortKey]: { id: byKeyPortID, label: null },
            },
            dynamic: [{ id: dynamicPortID, label: null }],
            builtIn: {
              [BaseModels.PortType.NEXT]: { id: builtInPortID, label: null },
            },
          },
        },
      });

      expect(result.ports).toEqual(
        normalizeContaining([{ id: builtInPortID }, { id: dynamicPortID }, { id: inPortID }, { id: byKeyPortID }])
      );
      expect(result.portsByNodeID).toEqual({
        [blockID]: { in: [inPortID], out: { byKey: {}, dynamic: [], builtIn: {} } },
        [stepID]: {
          in: [],
          out: {
            byKey: {
              [byKeyPortKey]: byKeyPortID,
            },
            dynamic: [dynamicPortID],
            builtIn: { [BaseModels.PortType.NEXT]: builtInPortID },
          },
        },
      });
      expect(result.nodeIDByPortID).toEqual({
        [inPortID]: blockID,
        [dynamicPortID]: stepID,
        [builtInPortID]: stepID,
        [byKeyPortID]: stepID,
      });
      expect(result.linkIDsByPortID).toEqual({
        [inPortID]: [],
        [dynamicPortID]: [],
        [builtInPortID]: [],
        [byKeyPortID]: [],
      });
    });
  });
});
