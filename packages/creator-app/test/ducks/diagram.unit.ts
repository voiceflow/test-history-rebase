/* eslint-disable mocha/no-identical-title */
import { Models as BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import client from '@/client';
import { FeatureFlag } from '@/config/features';
import * as Creator from '@/ducks/creator';
import * as DiagramV1 from '@/ducks/diagram';
import * as Diagram from '@/ducks/diagramV2';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import mutableStore from '@/store/mutable';

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
  type: BaseModels.DiagramType.COMPONENT,
  variables: ['fizz', 'buzz'],
  subDiagrams: [],
  intentStepIDs: [],
};

const DIAGRAM_VIEWER: Diagram.DiagramViewer = {
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
      type: BaseModels.DiagramType.TOPIC,
      variables: ['xyz'],
      subDiagrams: [],
      intentStepIDs: [],
    },
  },
  allKeys: [DIAGRAM_ID, 'abc'],
  awareness: {
    viewers: {
      [DIAGRAM_ID]: [DIAGRAM_VIEWER, { creatorID: 10, creator_id: 10, name: 'gray', color: '#777' }],
      abc: [{ creatorID: 1000, creator_id: 1000, name: 'caleb', color: '#aaa' }],
    },
  },
  intentSteps: {},
};

suite(Diagram, MOCK_STATE)('Ducks - Diagram', ({ expect, stub, spy, describeReducerV2, describeEffectV2, createState, ...utils }) => {
  const v2FeatureState = { [Feature.STATE_KEY]: { features: { [FeatureFlag.ATOMIC_ACTIONS]: { isEnabled: true } } } };

  describe('reducer', () => {
    utils.assertIgnoresOtherActions();
    utils.assertInitialState(Diagram.INITIAL_STATE);

    describeReducerV2(Realtime.diagram.addLocalVariable, ({ applyAction }) => {
      it('append new variable', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'foo' });

        expect(result.byKey[DIAGRAM_ID].variables).to.eql(['fizz', 'buzz', 'foo']);
      });

      it('do nothing if variable already exists', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'fizz' });

        expect(result).to.eq(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.diagram.removeLocalVariable, ({ applyAction }) => {
      it('remove a known variable', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'fizz' });

        expect(result.byKey[DIAGRAM_ID].variables).to.eql(['buzz']);
      });

      it('do nothing if variable does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'foo' });

        expect(result).to.eq(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.project.awareness.updateViewers, ({ applyAction }) => {
      it('adds viewers to new diagram', () => {
        const diagramID = 'foo';

        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, diagramID, viewers: [{ creatorID: CREATOR_ID, name: 'bar' }] });

        expect(result.awareness.viewers).to.eql({
          ...MOCK_STATE.awareness.viewers,
          [diagramID]: [{ creatorID: CREATOR_ID, creator_id: CREATOR_ID, name: 'bar', color: '5891FB|EFF5FF' }],
        });
      });

      it('replace viewers of known diagram', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, viewers: [{ creatorID: CREATOR_ID, name: 'bar' }] });

        expect(result.awareness.viewers[DIAGRAM_ID]).to.eql([{ creatorID: CREATOR_ID, creator_id: CREATOR_ID, name: 'bar', color: '5891FB|EFF5FF' }]);
      });
    });

    describeReducerV2(Realtime.project.awareness.loadViewers, ({ applyAction }) => {
      it('updates viewers of all diagrams', () => {
        const diagramID = 'foo';

        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          viewers: { [DIAGRAM_ID]: [{ creatorID: 456, name: 'bar' }], [diagramID]: [{ creatorID: 789, name: 'cat' }] },
        });

        expect(result.awareness.viewers).to.eql({
          ...MOCK_STATE.awareness.viewers,
          [DIAGRAM_ID]: [{ creatorID: 456, creator_id: 456, name: 'bar', color: '697986|EEF0F1' }],
          [diagramID]: [{ creatorID: 789, creator_id: 789, name: 'cat', color: 'D58B5F|FAF2ED' }],
        });
      });
    });
  });

  describe('selectors', () => {
    describe('allDiagramsSelector()', () => {
      it('select all diagrams from the legacy store', () => {
        const diagrams = Utils.generate.array(3, () => ({ id: Utils.generate.id() }));

        const result = Diagram.allDiagramsSelector(createState(MOCK_STATE, { [DiagramV1.STATE_KEY]: normalize(diagrams) }));

        expect(result).to.eql(diagrams);
      });

      it('select all diagrams', () => {
        const result = Diagram.allDiagramsSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.eql([DIAGRAM, MOCK_STATE.byKey.abc]);
      });
    });

    describe('allDiagramIDsSelector()', () => {
      it('select all diagrams IDs from the legacy store', () => {
        const diagramState = normalize(Utils.generate.array(3, () => ({ id: Utils.generate.id() })));

        const result = Diagram.allDiagramIDsSelector(createState(MOCK_STATE, { [DiagramV1.STATE_KEY]: diagramState }));

        expect(result).to.eq(diagramState.allKeys);
      });

      it('select all diagrams IDs', () => {
        const result = Diagram.allDiagramIDsSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.eq(MOCK_STATE.allKeys);
      });
    });

    describe('diagramMapSelector()', () => {
      it('select diagram map from the legacy store', () => {
        const diagramState = normalize(Utils.generate.array(3, () => ({ id: Utils.generate.id() })));

        const result = Diagram.diagramMapSelector(createState(MOCK_STATE, { [DiagramV1.STATE_KEY]: diagramState }));

        expect(result).to.eq(diagramState.byKey);
      });

      it('select diagram map', () => {
        const result = Diagram.diagramMapSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.eq(MOCK_STATE.byKey);
      });
    });

    describe('diagramByIDSelector()', () => {
      it('select diagram from the legacy store', () => {
        const diagram = { id: DIAGRAM_ID };
        const diagramState = normalize([diagram]);

        const result = Diagram.diagramByIDSelector(createState(MOCK_STATE, { [DiagramV1.STATE_KEY]: diagramState }), { id: DIAGRAM_ID });

        expect(result).to.eq(diagram);
      });

      it('select known diagram', () => {
        const result = Diagram.diagramByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: DIAGRAM_ID });

        expect(result).to.eq(DIAGRAM);
      });

      it('select unknown diagram', () => {
        const result = Diagram.diagramByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: 'foo' });

        expect(result).to.be.null;
      });
    });

    describe('diagramsByIDsSelector()', () => {
      it('select diagrams from the legacy store', () => {
        const diagram = { id: DIAGRAM_ID };
        const otherDiagramID = 'foo';
        const otherDiagram = { id: 'foo' };
        const diagramState = normalize([otherDiagram, diagram]);

        const result = Diagram.diagramsByIDsSelector(createState(MOCK_STATE, { [DiagramV1.STATE_KEY]: diagramState }), {
          ids: [DIAGRAM_ID, otherDiagramID],
        });

        expect(result).to.eql([diagram, otherDiagram]);
      });

      it('select known diagrams', () => {
        const result = Diagram.diagramsByIDsSelector(createState(MOCK_STATE, v2FeatureState), { ids: ['abc', DIAGRAM_ID] });

        expect(result).to.eql([MOCK_STATE.byKey.abc, DIAGRAM]);
      });

      it('select unknown diagrams', () => {
        const result = Diagram.diagramsByIDsSelector(createState(MOCK_STATE, v2FeatureState), { ids: ['foo', DIAGRAM_ID] });

        expect(result).to.eql([DIAGRAM]);
      });
    });

    describe('localVariablesByDiagramIDSelector()', () => {
      it('select local variables from the legacy store', () => {
        const diagram = { id: DIAGRAM_ID, variables: ['cat', 'bat', 'rat'] };
        const diagramState = normalize([diagram]);

        const result = Diagram.localVariablesByDiagramIDSelector(createState(MOCK_STATE, { [DiagramV1.STATE_KEY]: diagramState }), {
          id: DIAGRAM_ID,
        });

        expect(result).to.eq(diagram.variables);
      });

      it('select variables from known diagram', () => {
        const result = Diagram.localVariablesByDiagramIDSelector(createState(MOCK_STATE, v2FeatureState), { id: DIAGRAM_ID });

        expect(result).to.eq(DIAGRAM.variables);
      });

      it('select variables from unknown diagram', () => {
        const result = Diagram.localVariablesByDiagramIDSelector(createState(MOCK_STATE, v2FeatureState), { id: 'foo' });

        expect(result).to.eql([]);
      });
    });

    describe('awarenessStateSelector()', () => {
      it('select diagram awarenes state', () => {
        expect(Diagram.awarenessStateSelector(createState(MOCK_STATE))).to.eq(MOCK_STATE.awareness);
      });
    });

    describe('awarenessViewersSelector()', () => {
      it('select diagram viewers state', () => {
        expect(Diagram.awarenessViewersSelector(createState(MOCK_STATE))).to.eq(MOCK_STATE.awareness.viewers);
      });
    });

    describe('diagramViewersByIDSelector()', () => {
      it('select diagram viewers', () => {
        expect(Diagram.diagramViewersByIDSelector(createState(MOCK_STATE), { id: DIAGRAM_ID })).to.eq(MOCK_STATE.awareness.viewers[DIAGRAM_ID]);
      });

      it('select viewers of unknown diagram', () => {
        expect(Diagram.diagramViewersByIDSelector(createState(MOCK_STATE), { id: 'foo' })).to.eql([]);
      });
    });

    describe('diagramViewersIDsByIDSelector()', () => {
      it('select creator IDs of diagram viewers', () => {
        expect(Diagram.diagramViewersIDsByIDSelector(createState(MOCK_STATE), { id: DIAGRAM_ID })).to.eql([CREATOR_ID, 10]);
      });

      it('select creator IDs of viewers of unknown diagram', () => {
        expect(Diagram.diagramViewersIDsByIDSelector(createState(MOCK_STATE), { id: 'foo' })).to.eql([]);
      });
    });

    describe('hasExternalDiagramViewersByIDSelector()', () => {
      it('true if more than 1 active viewer', () => {
        expect(Diagram.hasExternalDiagramViewersByIDSelector(createState(MOCK_STATE), { id: DIAGRAM_ID })).to.be.true;
      });

      it('false if 1 or fewer active viewers', () => {
        expect(Diagram.hasExternalDiagramViewersByIDSelector(createState(MOCK_STATE), { id: 'abc' })).to.be.false;
      });

      it('false if diagram unknown', () => {
        expect(Diagram.hasExternalDiagramViewersByIDSelector(createState(MOCK_STATE), { id: 'abc' })).to.be.false;
      });
    });

    describe('diagramViewerByIDAndCreatorIDSelector()', () => {
      it('select known viewer from diagram', () => {
        expect(
          Diagram.diagramViewerByIDAndCreatorIDSelector(createState(MOCK_STATE, v2FeatureState), { id: DIAGRAM_ID, creatorID: CREATOR_ID })
        ).to.eq(DIAGRAM_VIEWER);
      });

      it('select unknown viewer from diagram', () => {
        expect(Diagram.diagramViewerByIDAndCreatorIDSelector(createState(MOCK_STATE, v2FeatureState), { id: DIAGRAM_ID, creatorID: -1 })).to.be.null;
      });

      it('select viewer from unknown diagram', () => {
        expect(Diagram.diagramViewerByIDAndCreatorIDSelector(createState(MOCK_STATE, v2FeatureState), { id: 'abc', creatorID: CREATOR_ID })).to.be
          .null;
      });
    });
  });

  describe('side effects', () => {
    describeEffectV2(DiagramV1.loadDiagrams, 'loadDiagrams()', ({ applyEffect }) => {
      it('loads all diagrams for a given version into the store', async () => {
        const diagrams = Utils.generate.array<any>(3, () => ({ id: Utils.generate.id() }));
        const dbDiagrams = Utils.generate.array<any>(3, () => ({ id: Utils.generate.id() }));
        const getDiagrams = stub(client.api.version, 'getDiagrams').resolves(dbDiagrams);
        const mapDiagramFromDB = stub(Realtime.Adapters.diagramAdapter, 'mapFromDB').returns(diagrams);

        const { result, dispatched } = await applyEffect(createState(MOCK_STATE), VERSION_ID, DIAGRAM_ID);

        expect(result).to.eq(diagrams);
        expect(dispatched).to.eql([DiagramV1.crud.replace(diagrams)]);
        expect(getDiagrams).to.be.calledWithExactly(VERSION_ID, ['_id', 'type', 'name', 'variables', 'children', 'intentStepIDs']);
        expect(mapDiagramFromDB).to.be.calledWithExactly(dbDiagrams, { rootDiagramID: DIAGRAM_ID });
      });

      it('do nothing if atomic actions enabled', async () => {
        const { result, dispatched } = await applyEffect(createState(MOCK_STATE, v2FeatureState), VERSION_ID, DIAGRAM_ID);

        expect(result).to.be.empty;
        expect(dispatched).to.be.empty;
      });
    });

    describeEffectV2(DiagramV1.loadLocalVariables, 'loadLocalVariables()', ({ applyEffect }) => {
      it('loads all variables for a given diagram into the store', async () => {
        const variables = Utils.generate.array(3, Utils.generate.string);

        const getDiagram = stub(client.api.diagram, 'get').resolves({ variables } as any);

        const { dispatched } = await applyEffect(createState(MOCK_STATE), DIAGRAM_ID);

        expect(dispatched).to.eql([DiagramV1.crud.patch(DIAGRAM_ID, { variables })]);
        expect(getDiagram).to.be.calledWithExactly(DIAGRAM_ID, ['variables']);
      });

      it('do nothing if atomic actions enabled', async () => {
        const { dispatched } = await applyEffect(createState(MOCK_STATE, v2FeatureState), DIAGRAM_ID);

        expect(dispatched).to.be.empty;
      });
    });

    describeEffectV2(DiagramV1.saveActiveDiagramVariables, 'saveActiveDiagramVariables()', ({ applyEffect }) => {
      it('saves all variables for the active diagram', async () => {
        const timestamp = String(Date.now());
        const variables = ['foo', 'bar'];
        const rootState = {
          [DiagramV1.STATE_KEY]: normalize([{ id: DIAGRAM_ID, variables }]),
          [Creator.STATE_KEY]: { diagram: { present: { diagramID: DIAGRAM_ID } } },
        };
        const updateDiagram = spy();
        const diagramClientFactory = stub(client.api.diagram, 'options').returns({ update: updateDiagram } as any);
        stub(mutableStore, 'getRTCTimestamp').returns(timestamp);

        await applyEffect(createState(MOCK_STATE, rootState));

        expect(diagramClientFactory).to.be.calledWithExactly({ headers: { rtctimestamp: timestamp } });
        expect(updateDiagram).to.be.calledWithExactly(DIAGRAM_ID, { variables });
      });

      it('do nothing if atomic actions enabled', async () => {
        const { dispatched } = await applyEffect(createState(MOCK_STATE, v2FeatureState));

        expect(dispatched).to.be.empty;
      });
    });

    describeEffectV2(DiagramV1.removeLocalVariable, 'removeLocalVariable()', ({ applyEffect }) => {
      it('remove variable from diagram locally', async () => {
        const rootState = {
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
          [DiagramV1.STATE_KEY]: normalize([{ id: DIAGRAM_ID, variables: ['foo', 'bar'] }]),
        };

        const { dispatched } = await applyEffect(createState(MOCK_STATE, rootState), DIAGRAM_ID, 'foo');

        expect(dispatched).to.eql([DiagramV1.crud.patch(DIAGRAM_ID, { variables: ['bar'] })]);
      });

      it('do nothing when removing variable from diagram locally if variable does not exist', async () => {
        const variables = ['foo', 'bar'];
        const rootState = {
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
          [DiagramV1.STATE_KEY]: normalize([{ id: DIAGRAM_ID, variables }]),
        };

        const { dispatched } = await applyEffect(createState(MOCK_STATE, rootState), DIAGRAM_ID, 'fizz');

        expect(dispatched).to.eql([DiagramV1.crud.patch(DIAGRAM_ID, { variables })]);
      });

      it('remove variable from diagram in realtime', async () => {
        const rootState = {
          ...v2FeatureState,
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
        };

        const { dispatched } = await applyEffect(createState(MOCK_STATE, rootState), DIAGRAM_ID, 'fizz');

        expect(dispatched).to.eql([{ sync: Realtime.diagram.removeLocalVariable({ ...ACTION_CONTEXT, variable: 'fizz' }) }]);
      });
    });

    describeEffectV2(DiagramV1.addLocalVariable, 'addLocalVariable()', ({ applyEffect }) => {
      it('add variable to diagram locally', async () => {
        const rootState = {
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
          [DiagramV1.STATE_KEY]: normalize([{ id: DIAGRAM_ID, variables: ['foo', 'bar'] }]),
        };

        const { dispatched } = await applyEffect(createState(MOCK_STATE, rootState), DIAGRAM_ID, 'fizz');

        expect(dispatched).to.eql([DiagramV1.crud.patch(DIAGRAM_ID, { variables: ['foo', 'bar', 'fizz'] })]);
      });

      it('fail if variable name is reserved javascript keyword', async () => {
        await expect(applyEffect(createState(MOCK_STATE), DIAGRAM_ID, 'new')).to.be.rejectedWith(
          "Reserved word. You can prefix with '_' to fix this issue"
        );
      });

      it('do nothing when adding variable to diagram locally if variable already exists', async () => {
        const variables = ['foo', 'bar'];
        const rootState = {
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
          [DiagramV1.STATE_KEY]: normalize([{ id: DIAGRAM_ID, variables }]),
        };

        const { dispatched } = await applyEffect(createState(MOCK_STATE, rootState), DIAGRAM_ID, 'foo');

        expect(dispatched).to.eql([DiagramV1.crud.patch(DIAGRAM_ID, { variables })]);
      });

      it('add variable to diagram in realtime', async () => {
        const rootState = {
          ...v2FeatureState,
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
        };

        const { dispatched } = await applyEffect(createState(MOCK_STATE, rootState), DIAGRAM_ID, 'fizz');

        expect(dispatched).to.eql([{ sync: Realtime.diagram.addLocalVariable({ ...ACTION_CONTEXT, variable: 'fizz' }) }]);
      });
    });

    describeEffectV2(DiagramV1.removeActiveDiagramVariable, 'removeActiveDiagramVariable()', ({ applyEffect }) => {
      it('remove variable from active diagram', async () => {
        const rootState = {
          ...v2FeatureState,
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
          [Creator.STATE_KEY]: { diagram: { present: { diagramID: DIAGRAM_ID } } },
        };

        const { dispatched } = await applyEffect(createState(MOCK_STATE, rootState), 'fizz');

        expect(dispatched).to.eql([{ sync: Realtime.diagram.removeLocalVariable({ ...ACTION_CONTEXT, variable: 'fizz' }) }]);
      });
    });

    describeEffectV2(DiagramV1.addActiveDiagramVariable, 'addActiveDiagramVariable()', ({ applyEffect }) => {
      it('add variable to active diagram', async () => {
        const rootState = {
          ...v2FeatureState,
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
          [Creator.STATE_KEY]: { diagram: { present: { diagramID: DIAGRAM_ID } } },
        };

        const { dispatched } = await applyEffect(createState(MOCK_STATE, rootState), 'fizz');

        expect(dispatched).to.eql([{ sync: Realtime.diagram.addLocalVariable({ ...ACTION_CONTEXT, variable: 'fizz' }) }]);
      });
    });
  });
});
