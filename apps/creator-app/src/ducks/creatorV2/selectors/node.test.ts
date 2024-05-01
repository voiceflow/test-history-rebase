import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';
import { describe, expect, it } from 'vitest';

import { createDuckTools } from '@/ducks/_suite';

import * as CreatorV2 from '..';
import { MOCK_STATE, NODE_DATA, PORT_ID } from '../creator.fixture';

const NODE_COORDS: Realtime.Point = [100, -100];
const NODE_PORTS: Realtime.NodePorts = { in: [], out: { byKey: {}, dynamic: [PORT_ID], builtIn: {} } };
const START_NODE = { ...NODE_DATA, nodeID: 'startID', type: Realtime.BlockType.START, name: 'def' };
const MARKUP_NODE = { ...NODE_DATA, nodeID: 'markupID' };
const BLOCK_NODE = { ...NODE_DATA, nodeID: 'blockID', type: Realtime.BlockType.COMBINED, name: 'abc' };
const STEP_NODE = { ...NODE_DATA, nodeID: 'stepID', type: Realtime.BlockType.CODE };

const INITIAL_STATE: CreatorV2.CreatorState = {
  ...MOCK_STATE,
  nodes: normalize([START_NODE, MARKUP_NODE, BLOCK_NODE, STEP_NODE], (node) => node.nodeID),
  coordsByNodeID: { [BLOCK_NODE.nodeID]: NODE_COORDS },
  parentNodeIDByStepID: { [STEP_NODE.nodeID]: BLOCK_NODE.nodeID },
  stepIDsByParentNodeID: { [BLOCK_NODE.nodeID]: [STEP_NODE.nodeID] },
  portsByNodeID: { [BLOCK_NODE.nodeID]: NODE_PORTS, [STEP_NODE.nodeID]: Realtime.Utils.port.createEmptyNodePorts() },
  markupIDs: [MARKUP_NODE.nodeID],
  blockIDs: [BLOCK_NODE.nodeID, START_NODE.nodeID],
};

const { createState, describeSelectors } = createDuckTools(CreatorV2, MOCK_STATE);

describe('Ducks | Creator V2 - node selectors', () => {
  describeSelectors(({ select }) => {
    describe('allNodeIDsSelector()', () => {
      it('select all node IDs', () => {
        expect(select(CreatorV2.allNodeIDsSelector)).toEqual([
          START_NODE.nodeID,
          MARKUP_NODE.nodeID,
          BLOCK_NODE.nodeID,
          STEP_NODE.nodeID,
        ]);
      });
    });

    describe('markupIDsSelector()', () => {
      it('select all markup node IDs', () => {
        expect(select(CreatorV2.markupIDsSelector)).toEqual([MARKUP_NODE.nodeID]);
      });
    });

    describe('blockIDsSelector()', () => {
      it('select all block node IDs', () => {
        expect(select(CreatorV2.blockIDsSelector)).toEqual([BLOCK_NODE.nodeID, START_NODE.nodeID]);
      });
    });

    describe('stepIDsSelector()', () => {
      it('select all step node IDs', () => {
        expect(select(CreatorV2.stepIDsSelector)).toEqual([STEP_NODE.nodeID]);
      });
    });

    describe('isBlockSelector()', () => {
      it('return true if node is a block', () => {
        expect(select((state) => CreatorV2.isBlockSelector(state, { id: BLOCK_NODE.nodeID }))).toBeTruthy();
      });

      it('return false if node is not a block', () => {
        expect(select((state) => CreatorV2.isBlockSelector(state, { id: MARKUP_NODE.nodeID }))).toBeFalsy();
      });
    });

    describe('isStepSelector()', () => {
      it('return true if node is a step', () => {
        expect(select((state) => CreatorV2.isStepSelector(state, { id: STEP_NODE.nodeID }))).toBeTruthy();
      });

      it('return false if node is not a step', () => {
        expect(select((state) => CreatorV2.isStepSelector(state, { id: MARKUP_NODE.nodeID }))).toBeFalsy();
      });
    });

    describe('startNodeIDSelector()', () => {
      it('select the ID of the start node', () => {
        expect(select(CreatorV2.startNodeIDSelector)).toBe(START_NODE.nodeID);
      });

      it('return null if no start node is found', () => {
        const rootState = createState({
          ...INITIAL_STATE,
          blockIDs: [BLOCK_NODE.nodeID],
          nodes: normalize([MARKUP_NODE, BLOCK_NODE], (node) => node.nodeID),
        });

        expect(select(CreatorV2.startNodeIDSelector, rootState)).toBeNull();
      });
    });

    describe('nodeDataByIDSelector()', () => {
      it('select node data by ID', () => {
        expect(select((state) => CreatorV2.nodeDataByIDSelector(state, { id: STEP_NODE.nodeID }))).toBe(STEP_NODE);
      });

      it('return null if unrecognized node ID', () => {
        expect(select((state) => CreatorV2.nodeDataByIDSelector(state, { id: 'foo' }))).toBeNull();
      });
    });

    describe('nodeDataByIDsSelector()', () => {
      it('select list of node data by IDs', () => {
        expect(
          select((state) => CreatorV2.nodeDataByIDsSelector(state, { ids: [STEP_NODE.nodeID, MARKUP_NODE.nodeID] }))
        ).toEqual([STEP_NODE, MARKUP_NODE]);
      });

      it('return empty list for unrecognized node IDs', () => {
        expect(select((state) => CreatorV2.nodeDataByIDsSelector(state, { ids: ['foo', 'bar'] }))).toEqual([]);
      });
    });

    describe('allNodeDataSelector()', () => {
      it('select all node data', () => {
        expect(select(CreatorV2.allNodeDataSelector)).toEqual([START_NODE, MARKUP_NODE, BLOCK_NODE, STEP_NODE]);
      });
    });

    describe('nodeTypeByIDSelector()', () => {
      it('select type of a node by ID', () => {
        expect(select((state) => CreatorV2.nodeTypeByIDSelector(state, { id: START_NODE.nodeID }))).toBe(
          Realtime.BlockType.START
        );
      });
    });

    describe('parentNodeIDByStepIDSelector()', () => {
      it('select the block ID of a step by ID', () => {
        expect(select((state) => CreatorV2.parentNodeIDByStepIDSelector(state, { id: STEP_NODE.nodeID }))).toBe(
          BLOCK_NODE.nodeID
        );
      });
    });

    describe('nodeOriginByIDSelector()', () => {
      it('select the block ID of a step by ID', () => {
        expect(select((state) => CreatorV2.nodeCoordsByIDSelector(state, { id: BLOCK_NODE.nodeID }))).toBe(NODE_COORDS);
      });
    });

    describe('stepIDsByParentNodeIDSelector()', () => {
      it('select the step IDs of a block by ID', () => {
        expect(select((state) => CreatorV2.stepIDsByParentNodeIDSelector(state, { id: BLOCK_NODE.nodeID }))).toEqual([
          STEP_NODE.nodeID,
        ]);
      });
    });

    describe('stepDataByParentNodeIDSelector()', () => {
      it('select the step data of a block by ID', () => {
        expect(select((state) => CreatorV2.stepDataByParentNodeIDSelector(state, { id: BLOCK_NODE.nodeID }))).toEqual([
          STEP_NODE,
        ]);
      });
    });

    describe('nodeByIDSelector()', () => {
      it('select a composed block node by ID', () => {
        const result = select((state) => CreatorV2.nodeByIDSelector(state, { id: BLOCK_NODE.nodeID }));

        expect(result).toEqual({
          id: BLOCK_NODE.nodeID,
          type: BLOCK_NODE.type,
          parentNode: null,
          combinedNodes: [STEP_NODE.nodeID],
          ports: NODE_PORTS,
          x: NODE_COORDS[0],
          y: NODE_COORDS[1],
        });
      });

      it('select a composed step node by ID', () => {
        const result = select((state) => CreatorV2.nodeByIDSelector(state, { id: STEP_NODE.nodeID }));

        expect(result).toEqual({
          id: STEP_NODE.nodeID,
          type: STEP_NODE.type,
          parentNode: BLOCK_NODE.nodeID,
          combinedNodes: [],
          ports: Realtime.Utils.port.createEmptyNodePorts(),
          x: 0,
          y: 0,
        });
      });
    });

    describe('nodesByIDsSelector()', () => {
      it('select a composed block node by ID', () => {
        const result = select((state) =>
          CreatorV2.nodesByIDsSelector(state, { ids: [BLOCK_NODE.nodeID, STEP_NODE.nodeID] })
        );

        expect(result).toEqual([
          {
            id: BLOCK_NODE.nodeID,
            type: BLOCK_NODE.type,
            parentNode: null,
            combinedNodes: [STEP_NODE.nodeID],
            ports: NODE_PORTS,
            x: NODE_COORDS[0],
            y: NODE_COORDS[1],
          },
          {
            id: STEP_NODE.nodeID,
            type: STEP_NODE.type,
            parentNode: BLOCK_NODE.nodeID,
            combinedNodes: [],
            ports: Realtime.Utils.port.createEmptyNodePorts(),
            x: 0,
            y: 0,
          },
        ]);
      });
    });
  });
});
