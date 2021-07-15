import { generate } from '@voiceflow/ui';

import { DiagramState } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Normalized from '@/utils/normalized';

import suite from './_suite';

const mockHistoryState = (present: any) => ({
  present,
  _latestUnfiltered: null,
  past: [],
  future: [],
  group: null,
  index: 0,
  limit: 1,
});

const MOCK_STATE = {
  diagram: mockHistoryState({}) as any,
  focus: {
    target: generate.id(),
    isActive: true,
    renameActiveRevision: generate.id(),
  } as Creator.FocusState,
  diagramsHistory: [],
};

suite(Creator, MOCK_STATE)('Ducks - Creator', ({ expect, describeReducer, describeSelectors }) => {
  describeReducer(
    {
      diagram: mockHistoryState(Creator.INITIAL_DIAGRAM_STATE),
      focus: Creator.INITIAL_FOCUS_STATE,
      diagramsHistory: Creator.INITIAL_DIAGRAMS_HISTORY_STATE,
    },
    ({ expectAction }) => {
      describe('initializeCreator()', () => {
        it('should persist existing state that is not overridden', () => {
          const diagram = { diagramID: 'abc', rootNodeIDs: [], nodes: [], links: [], ports: [], data: {}, markupNodeIDs: [] };

          expectAction(Creator.initializeCreator(diagram))
            .withState({ ...MOCK_STATE, diagram: { ...MOCK_STATE.diagram, present: { hidden: true } } })
            .toModify({
              diagram: {
                ...MOCK_STATE.diagram,
                present: {
                  hidden: true,
                  diagramID: diagram.diagramID,
                  diagramState: DiagramState.IDLE,
                  markupNodeIDs: [],
                  rootNodeIDs: [],
                  linkedNodesByNodeID: {},
                  linksByNodeID: {},
                  linksByPortID: {},
                  sections: {},
                  data: {},
                  links: Normalized.EMPTY,
                  nodes: Normalized.EMPTY,
                  ports: Normalized.EMPTY,
                },
              },
              focus: {
                isActive: false,
                renameActiveRevision: null,
                target: null,
              },
            });
        });
      });

      describe('showCanvas()', () => {
        it('should show the canvas', () => {
          expectAction(Creator.showCanvas()).toModify({ diagram: { ...MOCK_STATE.diagram, present: { hidden: false } } });
        });
      });

      describe('hideCanvas()', () => {
        it('should hide the canvas', () => {
          expectAction(Creator.hideCanvas()).toModify({ diagram: { ...MOCK_STATE.diagram, present: { hidden: true } } });
        });
      });

      describe('resetCreator()', () => {
        it('should reset the canvas state', () => {
          expectAction(Creator.resetCreator()).toModify({
            diagram: { ...MOCK_STATE.diagram, present: {} },
            focus: Creator.INITIAL_FOCUS_STATE,
          });
        });
      });

      describe('setFocus()', () => {
        const nodeID = generate.id();

        it('should set focus', () => {
          expectAction(Creator.setFocus(nodeID)).toModify({
            focus: {
              target: nodeID,
              isActive: true,
              renameActiveRevision: null,
            },
          });
        });

        it('should set focus with revision', () => {
          const revision = generate.id();

          expectAction(Creator.setFocus(nodeID, revision)).toModify({
            focus: {
              target: nodeID,
              isActive: true,
              renameActiveRevision: revision,
            },
          });
        });

        it('should not modify state if target already active', () => {
          const revision = generate.id();

          expectAction(Creator.setFocus(nodeID, revision))
            .withState({
              ...MOCK_STATE,
              focus: {
                target: nodeID,
                isActive: true,
                renameActiveRevision: revision,
              },
            })
            .toNotModify();
        });
      });

      describe('clearFocus()', () => {
        it('should clear focus', () => {
          expectAction(Creator.clearFocus()).toModify({
            focus: {
              ...MOCK_STATE.focus,
              isActive: false,
              renameActiveRevision: null,
            },
          });
        });

        it('should not clear focus if not active', () => {
          expectAction(Creator.clearFocus())
            .withState({
              ...MOCK_STATE,
              focus: {
                ...MOCK_STATE.focus,
                isActive: false,
              },
            })
            .toNotModify();
        });
      });
    }
  );

  describeSelectors(({ select }) => {
    describe('isHiddenSelector()', () => {
      it('should select canvas hidden state', () => {
        expect(select(Creator.isHiddenSelector, { creator: { diagram: { present: { hidden: true } } } })).to.eq(true);
      });
    });
  });
});
