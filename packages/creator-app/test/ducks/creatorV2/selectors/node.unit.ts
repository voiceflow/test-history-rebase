import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { LINK, MOCK_STATE, NODE_DATA, PORT_ID, V2_FEATURE_STATE } from '../_fixtures';

const NODE_COORDS: Realtime.Point = [100, -100];
const NODE_PORTS: Realtime.NodePorts = { in: [], out: { dynamic: [PORT_ID], builtIn: {} } };
const START_NODE = { ...NODE_DATA, nodeID: 'startID', type: Realtime.BlockType.START, name: 'def' };
const MARKUP_NODE = { ...NODE_DATA, nodeID: 'markupID' };
const BLOCK_NODE = { ...NODE_DATA, nodeID: 'blockID', type: Realtime.BlockType.COMBINED, name: 'abc' };
const STEP_NODE = { ...NODE_DATA, nodeID: 'stepID', type: Realtime.BlockType.CODE };

const INITIAL_STATE: CreatorV2.CreatorState = {
  ...MOCK_STATE,
  nodes: normalize([START_NODE, MARKUP_NODE, BLOCK_NODE, STEP_NODE], (node) => node.nodeID),
  coordsByNodeID: { [BLOCK_NODE.nodeID]: NODE_COORDS },
  blockIDByStepID: { [STEP_NODE.nodeID]: BLOCK_NODE.nodeID },
  stepIDsByBlockID: { [BLOCK_NODE.nodeID]: [STEP_NODE.nodeID] },
  portsByNodeID: { [BLOCK_NODE.nodeID]: NODE_PORTS, [STEP_NODE.nodeID]: Realtime.Utils.port.createEmptyNodePorts() },
  markupIDs: [MARKUP_NODE.nodeID],
  blockIDs: [BLOCK_NODE.nodeID, START_NODE.nodeID],
};

suite(CreatorV2, INITIAL_STATE)('Ducks | Creator V2 - node selectors', ({ expect, describeSelectors, createState }) => {
  describeSelectors(({ select }) => {
    describe('allNodeIDsSelector()', () => {
      it('select all node IDs', () => {
        expect(select(CreatorV2.allNodeIDsSelector, V2_FEATURE_STATE)).to.eql([
          START_NODE.nodeID,
          MARKUP_NODE.nodeID,
          BLOCK_NODE.nodeID,
          STEP_NODE.nodeID,
        ]);
      });
    });

    describe('markupIDsSelector()', () => {
      it('select all markup node IDs', () => {
        expect(select(CreatorV2.markupIDsSelector, V2_FEATURE_STATE)).to.eql([MARKUP_NODE.nodeID]);
      });
    });

    describe('blockIDsSelector()', () => {
      it('select all block node IDs', () => {
        expect(select(CreatorV2.blockIDsSelector, V2_FEATURE_STATE)).to.eql([BLOCK_NODE.nodeID, START_NODE.nodeID]);
      });
    });

    describe('stepIDsSelector()', () => {
      it('select all step node IDs', () => {
        expect(select(CreatorV2.stepIDsSelector, V2_FEATURE_STATE)).to.eql([STEP_NODE.nodeID]);
      });
    });

    describe('isBlockSelector()', () => {
      it('return true if node is a block', () => {
        expect(select((state) => CreatorV2.isBlockSelector(state, { id: BLOCK_NODE.nodeID }), V2_FEATURE_STATE)).to.be.true;
      });

      it('return false if node is not a block', () => {
        expect(select((state) => CreatorV2.isBlockSelector(state, { id: MARKUP_NODE.nodeID }), V2_FEATURE_STATE)).to.be.false;
      });
    });

    describe('isStepSelector()', () => {
      it('return true if node is a step', () => {
        expect(select((state) => CreatorV2.isStepSelector(state, { id: STEP_NODE.nodeID }), V2_FEATURE_STATE)).to.be.true;
      });

      it('return false if node is not a step', () => {
        expect(select((state) => CreatorV2.isStepSelector(state, { id: MARKUP_NODE.nodeID }), V2_FEATURE_STATE)).to.be.false;
      });
    });

    describe('startNodeIDSelector()', () => {
      it('select the ID of the start node', () => {
        expect(select(CreatorV2.startNodeIDSelector, V2_FEATURE_STATE)).to.eq(START_NODE.nodeID);
      });

      it('return null if no start node is found', () => {
        const rootState = createState(
          {
            ...INITIAL_STATE,
            blockIDs: [BLOCK_NODE.nodeID],
            nodes: normalize([MARKUP_NODE, BLOCK_NODE], (node) => node.nodeID),
          },
          V2_FEATURE_STATE
        );

        expect(select(CreatorV2.startNodeIDSelector, rootState)).to.be.null;
      });
    });

    describe('nodeDataByIDSelector()', () => {
      it('select node data by ID', () => {
        expect(select((state) => CreatorV2.nodeDataByIDSelector(state, { id: STEP_NODE.nodeID }), V2_FEATURE_STATE)).to.eq(STEP_NODE);
      });

      it('return null if unrecognized node ID', () => {
        expect(select((state) => CreatorV2.nodeDataByIDSelector(state, { id: 'foo' }), V2_FEATURE_STATE)).to.be.null;
      });
    });

    describe('nodeDataByIDsSelector()', () => {
      it('select list of node data by IDs', () => {
        expect(select((state) => CreatorV2.nodeDataByIDsSelector(state, { ids: [STEP_NODE.nodeID, MARKUP_NODE.nodeID] }), V2_FEATURE_STATE)).to.eql([
          STEP_NODE,
          MARKUP_NODE,
        ]);
      });

      it('return empty list for unrecognized node IDs', () => {
        expect(select((state) => CreatorV2.nodeDataByIDsSelector(state, { ids: ['foo', 'bar'] }), V2_FEATURE_STATE)).to.be.empty;
      });
    });

    describe('allNodeDataSelector()', () => {
      it('select all node data', () => {
        expect(select(CreatorV2.allNodeDataSelector, V2_FEATURE_STATE)).to.eql([START_NODE, MARKUP_NODE, BLOCK_NODE, STEP_NODE]);
      });
    });

    describe('allBlocksDataSelector()', () => {
      it('select all block data', () => {
        expect(select(CreatorV2.allBlocksDataSelector, V2_FEATURE_STATE)).to.eql([BLOCK_NODE, START_NODE]);
      });
    });

    describe('nodeTypeByIDSelector()', () => {
      it('select type of a node by ID', () => {
        expect(select((state) => CreatorV2.nodeTypeByIDSelector(state, { id: START_NODE.nodeID }), V2_FEATURE_STATE)).to.eq(Realtime.BlockType.START);
      });
    });

    describe('blockIDByStepIDSelector()', () => {
      it('select the block ID of a step by ID', () => {
        expect(select((state) => CreatorV2.blockIDByStepIDSelector(state, { id: STEP_NODE.nodeID }), V2_FEATURE_STATE)).to.eq(BLOCK_NODE.nodeID);
      });
    });

    describe('nodeOriginByIDSelector()', () => {
      it('select the block ID of a step by ID', () => {
        expect(select((state) => CreatorV2.nodeCoordsByIDSelector(state, { id: BLOCK_NODE.nodeID }), V2_FEATURE_STATE)).to.eq(NODE_COORDS);
      });
    });

    describe('stepIDsByBlockIDSelector()', () => {
      it('select the step IDs of a block by ID', () => {
        expect(select((state) => CreatorV2.stepIDsByBlockIDSelector(state, { id: BLOCK_NODE.nodeID }), V2_FEATURE_STATE)).to.eql([STEP_NODE.nodeID]);
      });
    });

    describe('stepDataByBlockIDSelector()', () => {
      it('select the step data of a block by ID', () => {
        expect(select((state) => CreatorV2.stepDataByBlockIDSelector(state, { id: BLOCK_NODE.nodeID }), V2_FEATURE_STATE)).to.eql([STEP_NODE]);
      });
    });

    describe('linkedNodeIDsByNodeIDSelector()', () => {
      it('select the step data of a block by ID', () => {
        const fooLink = { ...LINK, id: 'fooLink' };
        const barLink = { ...LINK, id: 'barLink' };
        const rootState = createState(
          {
            ...INITIAL_STATE,
            linkIDsByNodeID: { [BLOCK_NODE.nodeID]: [fooLink.id, barLink.id] },
            nodeIDsByLinkID: { [fooLink.id]: ['a', BLOCK_NODE.nodeID, 'b', 'c'], [barLink.id]: ['b', 'c', 'd', 'e', BLOCK_NODE.nodeID] },
          },
          V2_FEATURE_STATE
        );

        const result = select((state) => CreatorV2.linkedNodeIDsByNodeIDSelector(state, { id: BLOCK_NODE.nodeID }), rootState);

        expect(result).to.eql(['a', 'b', 'c', 'd', 'e']);
      });
    });

    describe('nodeByIDSelector()', () => {
      it('select a composed block node by ID', () => {
        const result = select((state) => CreatorV2.nodeByIDSelector(state, { id: BLOCK_NODE.nodeID }), V2_FEATURE_STATE);

        expect(result).to.eql({
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
        const result = select((state) => CreatorV2.nodeByIDSelector(state, { id: STEP_NODE.nodeID }), V2_FEATURE_STATE);

        expect(result).to.eql({
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
        const result = select((state) => CreatorV2.nodesByIDsSelector(state, { ids: [BLOCK_NODE.nodeID, STEP_NODE.nodeID] }), V2_FEATURE_STATE);

        expect(result).to.eql([
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
