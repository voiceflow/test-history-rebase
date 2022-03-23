import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { normalize } from 'normal-store';

import { BlockVariant } from '@/constants/canvas';
import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { ACTION_CONTEXT, MOCK_STATE, NODE_ID } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - addBlock reducer', ({ expect, describeReducerV2 }) => {
  describeReducerV2(Realtime.node.addBlock, ({ applyAction }) => {
    const blockID = 'blockNode';
    const stepID = 'stepNode';
    const blockName = 'New Block';
    const blockCoords: Realtime.Point = [100, 200];
    const stepData = { type: Realtime.BlockType.BUTTONS, name: 'node name' };

    it('ignore adding a block for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        blockID,
        stepID,
        blockCoords,
        blockName,
        blockPorts: Realtime.Utils.port.createEmptyNodePorts(),
        stepPorts: Realtime.Utils.port.createEmptyNodePorts(),
        stepData,
        projectMeta: {
          platform: VoiceflowConstants.PlatformType.VOICEFLOW,
          type: VoiceflowConstants.ProjectType.CHAT,
        },
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore adding block with duplicate ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        blockID: NODE_ID,
        stepID,
        blockCoords,
        blockName,
        blockPorts: Realtime.Utils.port.createEmptyNodePorts(),
        stepPorts: Realtime.Utils.port.createEmptyNodePorts(),
        stepData,
        projectMeta: {
          platform: VoiceflowConstants.PlatformType.VOICEFLOW,
          type: VoiceflowConstants.ProjectType.CHAT,
        },
      });

      expect(result).to.eql(MOCK_STATE);
    });

    it('ignore adding step with duplicate ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        blockID,
        stepID: NODE_ID,
        blockCoords,
        blockName,
        blockPorts: Realtime.Utils.port.createEmptyNodePorts(),
        stepPorts: Realtime.Utils.port.createEmptyNodePorts(),
        stepData,
        projectMeta: {
          platform: VoiceflowConstants.PlatformType.VOICEFLOW,
          type: VoiceflowConstants.ProjectType.CHAT,
        },
      });

      expect(result).to.eql(MOCK_STATE);
    });

    it('add a block and step', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        blockID,
        stepID,
        blockCoords,
        blockName,
        blockPorts: Realtime.Utils.port.createEmptyNodePorts(),
        stepPorts: Realtime.Utils.port.createEmptyNodePorts(),
        stepData,
        projectMeta: {
          platform: VoiceflowConstants.PlatformType.VOICEFLOW,
          type: VoiceflowConstants.ProjectType.CHAT,
        },
      });

      expect(result.nodes).to.containSubset(
        normalize(
          [
            { type: Realtime.BlockType.COMBINED, blockColor: BlockVariant.STANDARD, nodeID: blockID, name: blockName },
            { ...stepData, nodeID: stepID },
          ],
          (node) => node.nodeID
        )
      );
      expect(result.blockIDs).to.eql([blockID]);
      expect(result.coordsByNodeID).to.eql({ [blockID]: blockCoords });
      expect(result.stepIDsByBlockID).to.eql({ [blockID]: [stepID] });
      expect(result.blockIDByStepID).to.eql({ [stepID]: blockID });
      expect(result.portsByNodeID).to.eql({
        [blockID]: Realtime.Utils.port.createEmptyNodePorts(),
        [stepID]: Realtime.Utils.port.createEmptyNodePorts(),
      });
      expect(result.linkIDsByNodeID).to.eql({ [blockID]: [], [stepID]: [] });
    });

    it('register all ports of an added block and step', () => {
      const inPortID = 'inPort';
      const dynamicPortID = 'dynamicPort';
      const builtInPortID = 'builtInPort';

      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        blockID,
        stepID,
        blockCoords,
        blockName: 'New Block',
        stepData,
        blockPorts: {
          in: [{ id: inPortID }],
          out: { dynamic: [], builtIn: {} },
        },
        stepPorts: {
          in: [],
          out: {
            dynamic: [{ id: dynamicPortID }],
            builtIn: {
              [BaseModels.PortType.NEXT]: { id: builtInPortID },
            },
          },
        },
        projectMeta: {
          platform: VoiceflowConstants.PlatformType.VOICEFLOW,
          type: VoiceflowConstants.ProjectType.CHAT,
        },
      });

      expect(result.ports).to.containSubset(normalize([{ id: builtInPortID }, { id: dynamicPortID }, { id: inPortID }]));
      expect(result.portsByNodeID).to.eql({
        [blockID]: { in: [inPortID], out: { dynamic: [], builtIn: {} } },
        [stepID]: {
          in: [],
          out: {
            dynamic: [dynamicPortID],
            builtIn: { [BaseModels.PortType.NEXT]: builtInPortID },
          },
        },
      });
      expect(result.nodeIDByPortID).to.eql({ [inPortID]: blockID, [dynamicPortID]: stepID, [builtInPortID]: stepID });
      expect(result.linkIDsByPortID).to.eql({ [inPortID]: [], [dynamicPortID]: [], [builtInPortID]: [] });
    });
  });
});
