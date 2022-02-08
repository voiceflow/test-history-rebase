import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';
import { createEmptyNodePorts } from '@/ducks/creatorV2/utils';

import suite from '../../_suite';
import { ACTION_CONTEXT, MOCK_STATE, NODE_DATA, NODE_ID, PORT } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - insertStep reducer', ({ expect, describeReducerV2 }) => {
  describeReducerV2(Realtime.node.insertStep, ({ applyAction }) => {
    const blockNode = { ...NODE_DATA, nodeID: 'blockNode' };
    const stepID = 'stepNode';
    const stepData = { type: Realtime.BlockType.BUTTONS, name: 'node name', path: [] };

    it('ignore inserting steps for a different diagram', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        diagramID: 'foo',
        blockID: blockNode.nodeID,
        stepID,
        ports: createEmptyNodePorts(),
        data: stepData,
        index: 1,
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('ignore inserting step with duplicate ID', () => {
      const result = applyAction(
        {
          ...MOCK_STATE,
          nodes: normalize([NODE_DATA], (node) => node.nodeID),
        },
        {
          ...ACTION_CONTEXT,
          blockID: blockNode.nodeID,
          stepID: NODE_ID,
          ports: createEmptyNodePorts(),
          data: stepData,
          index: 1,
        }
      );

      expect(result).to.eql(MOCK_STATE);
    });

    it('ignore inserting step with unrecognized block ID', () => {
      const result = applyAction(MOCK_STATE, {
        ...ACTION_CONTEXT,
        blockID: blockNode.nodeID,
        stepID,
        ports: createEmptyNodePorts(),
        data: stepData,
        index: 1,
      });

      expect(result).to.eq(MOCK_STATE);
    });

    it('insert a new step into an existing block', () => {
      const result = applyAction(
        {
          ...MOCK_STATE,
          nodes: normalize([blockNode], (node) => node.nodeID),
          stepIDsByBlockID: { [blockNode.nodeID]: ['foo', 'bar'] },
        },
        {
          ...ACTION_CONTEXT,
          blockID: blockNode.nodeID,
          stepID,
          ports: createEmptyNodePorts(),
          data: stepData,
          index: 1,
        }
      );

      expect(result.nodes).to.eql(normalize([blockNode, { ...stepData, nodeID: stepID }], (node) => node.nodeID));
      expect(result.blockIDByStepID).to.eql({ [stepID]: blockNode.nodeID });
      expect(result.stepIDsByBlockID).to.eql({ [blockNode.nodeID]: ['foo', stepID, 'bar'] });
      expect(result.portsByNodeID).to.eql({ [stepID]: createEmptyNodePorts() });
      expect(result.linkIDsByNodeID).to.eql({ [stepID]: [] });
    });

    it('register all ports of an inserted step', () => {
      const inPortID = 'inPort';
      const dynamicPortID = 'dynamicPort';
      const builtInPortID = 'builtInPort';

      const result = applyAction(
        {
          ...MOCK_STATE,
          nodes: normalize([blockNode], (node) => node.nodeID),
          stepIDsByBlockID: { [blockNode.nodeID]: ['foo', 'bar'] },
        },
        {
          ...ACTION_CONTEXT,
          blockID: blockNode.nodeID,
          stepID,
          ports: {
            in: [{ id: inPortID }],
            out: {
              dynamic: [{ id: dynamicPortID }],
              builtIn: {
                [Models.PortType.NEXT]: { id: builtInPortID },
              },
            },
          },
          data: stepData,
          index: 1,
        }
      );

      expect(result.ports).to.containSubset(normalize([PORT, { id: inPortID }, { id: dynamicPortID }, { id: builtInPortID }]));
      expect(result.portsByNodeID).to.eql({
        [stepID]: {
          in: [inPortID],
          out: {
            dynamic: [dynamicPortID],
            builtIn: { [Models.PortType.NEXT]: builtInPortID },
          },
        },
      });
      expect(result.nodeIDByPortID).to.eql({ [inPortID]: stepID, [dynamicPortID]: stepID, [builtInPortID]: stepID });
      expect(result.linkIDsByPortID).to.eql({ [inPortID]: [], [dynamicPortID]: [], [builtInPortID]: [] });
    });
  });
});
