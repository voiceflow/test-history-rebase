import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramV1 from '@/ducks/diagram';
import * as Diagram from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import { State } from '@/store/types';

import { MOCK_STATE as INITIAL_ROOT_MOCK_STATE } from './_fixtures';
import suite from './_suite';

const WORKSPACE_ID = 'workspaceID';
const PROJECT_ID = 'projectID';
const VERSION_ID = 'versionID';
const DIAGRAM_ID = 'diagramID';
const CREATOR_ID = 999;
const ACTION_CONTEXT = { workspaceID: WORKSPACE_ID, projectID: PROJECT_ID, versionID: VERSION_ID, diagramID: DIAGRAM_ID };

const DIAGRAM: Realtime.Diagram = {
  id: DIAGRAM_ID,
  name: 'diagram',
  type: BaseModels.Diagram.DiagramType.COMPONENT,
  variables: ['fizz', 'buzz'],
  menuItems: [],
};

const DIAGRAM_VIEWER: ProjectV2.DiagramViewer = {
  creatorID: CREATOR_ID,
  creator_id: CREATOR_ID,
  name: 'alex',
  color: '#fff',
};

const MOCK_STATE: Diagram.DiagramState = {
  byKey: {
    [DIAGRAM_ID]: DIAGRAM,
    abc: {
      id: 'abc',
      name: 'alphabet diagram',
      type: BaseModels.Diagram.DiagramType.TOPIC,
      variables: ['xyz'],
      menuItems: [],
    },
  },
  allKeys: [DIAGRAM_ID, 'abc'],
  awareness: {
    locks: {},
  },
  sharedNodes: {},
  globalIntentStepMap: {},
};

const ROOT_MOCK_STATE: State = {
  ...INITIAL_ROOT_MOCK_STATE,
  [ProjectV2.STATE_KEY]: {
    ...INITIAL_ROOT_MOCK_STATE[ProjectV2.STATE_KEY],
    awareness: {
      viewers: {
        [PROJECT_ID]: {
          [DIAGRAM_ID]: Normal.normalize([DIAGRAM_VIEWER, { creatorID: 10, creator_id: 10, name: 'gray', color: '#777' }], (viewer) =>
            String(viewer.creatorID)
          ),
          abc: Normal.normalize([{ creatorID: 1000, creator_id: 1000, name: 'caleb', color: '#aaa' }], (viewer) => String(viewer.creatorID)),
        },
      },
    },
  },
  [Session.STATE_KEY]: {
    ...INITIAL_ROOT_MOCK_STATE.session,
    activeProjectID: PROJECT_ID,
  },
};

suite(Diagram, MOCK_STATE)('Ducks - Diagram', ({ describeReducerV2, describeEffectV2, createState, ...utils }) => {
  describe('reducer', () => {
    utils.assertIgnoresOtherActions();
    utils.assertInitialState(Diagram.INITIAL_STATE);

    describeReducerV2(Realtime.diagram.addLocalVariable, ({ applyAction }) => {
      it('append new variable', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'foo' });

        expect(result.byKey[DIAGRAM_ID].variables).toEqual(['fizz', 'buzz', 'foo']);
      });

      it('do nothing if variable already exists', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'fizz' });

        expect(result).toBe(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.diagram.removeLocalVariable, ({ applyAction }) => {
      it('remove a known variable', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'fizz' });

        expect(result.byKey[DIAGRAM_ID].variables).toEqual(['buzz']);
      });

      it('do nothing if variable does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'foo' });

        expect(result).toBe(MOCK_STATE);
      });
    });
  });

  describe('selectors', () => {
    describe('allDiagramsSelector()', () => {
      it('select all diagrams', () => {
        const result = Diagram.allDiagramsSelector(createState(MOCK_STATE));

        expect(result).toEqual([DIAGRAM, MOCK_STATE.byKey.abc]);
      });
    });

    describe('allDiagramIDsSelector()', () => {
      it('select all diagrams IDs', () => {
        const result = Diagram.allDiagramIDsSelector(createState(MOCK_STATE));

        expect(result).toBe(MOCK_STATE.allKeys);
      });
    });

    describe('diagramMapSelector()', () => {
      it('select diagram map', () => {
        const result = Diagram.diagramMapSelector(createState(MOCK_STATE));

        expect(result).toBe(MOCK_STATE.byKey);
      });
    });

    describe('diagramByIDSelector()', () => {
      it('select known diagram', () => {
        const result = Diagram.diagramByIDSelector(createState(MOCK_STATE), { id: DIAGRAM_ID });

        expect(result).toBe(DIAGRAM);
      });

      it('select unknown diagram', () => {
        const result = Diagram.diagramByIDSelector(createState(MOCK_STATE), { id: 'foo' });

        expect(result).toBeNull();
      });
    });

    describe('diagramsByIDsSelector()', () => {
      it('select known diagrams', () => {
        const result = Diagram.diagramsByIDsSelector(createState(MOCK_STATE), { ids: ['abc', DIAGRAM_ID] });

        expect(result).toEqual([MOCK_STATE.byKey.abc, DIAGRAM]);
      });

      it('select unknown diagrams', () => {
        const result = Diagram.diagramsByIDsSelector(createState(MOCK_STATE), { ids: ['foo', DIAGRAM_ID] });

        expect(result).toEqual([DIAGRAM]);
      });
    });

    describe('localVariablesByDiagramIDSelector()', () => {
      it('select variables from known diagram', () => {
        const result = Diagram.localVariablesByDiagramIDSelector(createState(MOCK_STATE), { id: DIAGRAM_ID });

        expect(result).toBe(DIAGRAM.variables);
      });

      it('select variables from unknown diagram', () => {
        const result = Diagram.localVariablesByDiagramIDSelector(createState(MOCK_STATE), { id: 'foo' });

        expect(result).toEqual([]);
      });
    });

    describe('awarenessStateSelector()', () => {
      it('select diagram awarenes state', () => {
        expect(Diagram.awarenessStateSelector(createState(MOCK_STATE))).toBe(MOCK_STATE.awareness);
      });
    });

    describe('diagramViewersByIDSelector()', () => {
      it('select diagram viewers', () => {
        expect(Diagram.diagramViewersByIDSelector(createState(MOCK_STATE, ROOT_MOCK_STATE), { id: DIAGRAM_ID })).toEqual(
          Normal.denormalize(ROOT_MOCK_STATE.projectV2.awareness.viewers[PROJECT_ID][DIAGRAM_ID])
        );
      });

      it('select viewers of unknown diagram', () => {
        expect(Diagram.diagramViewersByIDSelector(createState(MOCK_STATE, ROOT_MOCK_STATE), { id: 'foo' })).toEqual([]);
      });
    });

    describe('hasExternalDiagramViewersByIDSelector()', () => {
      it('true if more than 1 active viewer', () => {
        expect(Diagram.hasExternalDiagramViewersByIDSelector(createState(MOCK_STATE, ROOT_MOCK_STATE), { id: DIAGRAM_ID })).toBeTruthy();
      });

      it('false if 1 or fewer active viewers', () => {
        expect(Diagram.hasExternalDiagramViewersByIDSelector(createState(MOCK_STATE, ROOT_MOCK_STATE), { id: 'abc' })).toBeFalsy();
      });

      it('false if diagram unknown', () => {
        expect(Diagram.hasExternalDiagramViewersByIDSelector(createState(MOCK_STATE, ROOT_MOCK_STATE), { id: 'abc' })).toBeFalsy();
      });
    });

    describe('diagramViewerByIDAndCreatorIDSelector()', () => {
      it('select known viewer from diagram', () => {
        expect(
          Diagram.diagramViewerByIDAndCreatorIDSelector(createState(MOCK_STATE, ROOT_MOCK_STATE), { id: DIAGRAM_ID, creatorID: CREATOR_ID })
        ).toBe(DIAGRAM_VIEWER);
      });

      it('select unknown viewer from diagram', () => {
        expect(Diagram.diagramViewerByIDAndCreatorIDSelector(createState(MOCK_STATE, ROOT_MOCK_STATE), { id: DIAGRAM_ID, creatorID: -1 })).toBeNull();
      });

      it('select viewer from unknown diagram', () => {
        expect(
          Diagram.diagramViewerByIDAndCreatorIDSelector(createState(MOCK_STATE, ROOT_MOCK_STATE), { id: 'abc', creatorID: CREATOR_ID })
        ).toBeNull();
      });
    });
  });

  describe('side effects', () => {
    describeEffectV2(DiagramV1.removeActiveDiagramVariable, 'removeActiveDiagramVariable()', ({ applyEffect }) => {
      it('remove variable from active diagram', async () => {
        const rootState = {
          [Session.STATE_KEY]: {
            activeWorkspaceID: WORKSPACE_ID,
            activeProjectID: PROJECT_ID,
            activeVersionID: VERSION_ID,
          },
          [CreatorV2.STATE_KEY]: { activeDiagramID: DIAGRAM_ID },
        };

        const { dispatched } = await applyEffect(createState(MOCK_STATE, rootState), 'fizz');

        expect(dispatched).toEqual([{ sync: Realtime.diagram.removeLocalVariable({ ...ACTION_CONTEXT, variable: 'fizz' }) }]);
      });
    });

    describeEffectV2(DiagramV1.addActiveDiagramVariable, 'addActiveDiagramVariable()', ({ applyEffect }) => {
      it('add variable to active diagram', async () => {
        const rootState = {
          [Session.STATE_KEY]: {
            activeWorkspaceID: WORKSPACE_ID,
            activeProjectID: PROJECT_ID,
            activeVersionID: VERSION_ID,
          },
          [CreatorV2.STATE_KEY]: { activeDiagramID: DIAGRAM_ID },
        };

        const { dispatched } = await applyEffect(createState(MOCK_STATE, rootState), 'fizz', CanvasCreationType.IMM);

        expect(dispatched).toEqual([{ sync: Realtime.diagram.addLocalVariable({ ...ACTION_CONTEXT, variable: 'fizz' }) }]);
      });
    });
  });
});
