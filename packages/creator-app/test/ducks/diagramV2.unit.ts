import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Diagram from '@/ducks/diagramV2';

import suite from './_suite';

const WORKSPACE_ID = 'workspaceID';
const PROJECT_ID = 'projectID';
const VERSION_ID = 'versionID';
const DIAGRAM_ID = 'diagramID';
const INTENT_ID = 'intentID';
const STEP_ID = 'stepID';
const ACTION_CONTEXT = { workspaceID: WORKSPACE_ID, projectID: PROJECT_ID, versionID: VERSION_ID };

const DIAGRAM: Realtime.Diagram = {
  id: DIAGRAM_ID,
  type: BaseModels.Diagram.DiagramType.TOPIC,
  name: 'diagram',
  variables: ['var_foo', 'var_bar'],
  intentStepIDs: [STEP_ID, 'otherIntentID'],
  subDiagrams: [],
};

const MOCK_STATE: Diagram.DiagramState = {
  byKey: {
    [DIAGRAM_ID]: DIAGRAM,
    abc: {
      id: 'abc',
      type: BaseModels.Diagram.DiagramType.COMPONENT,
      name: 'alphabet diagram',
      variables: [],
      intentStepIDs: [],
      subDiagrams: [],
    },
  },
  allKeys: [DIAGRAM_ID, 'abc'],
  awareness: {
    viewers: {},
  },
  intentSteps: {
    [DIAGRAM_ID]: {
      [STEP_ID]: { intentID: INTENT_ID, global: true },
    },
  },
  globalIntentStepMap: {
    [DIAGRAM_ID]: {
      [INTENT_ID]: [STEP_ID],
    },
  },
};

suite(Diagram, MOCK_STATE)('Ducks - Diagram V2', ({ expect, describeReducerV2, createState, ...utils }) => {
  describe('reducer', () => {
    utils.assertIgnoresOtherActions();
    utils.assertInitialState(Diagram.INITIAL_STATE);

    describeReducerV2(Realtime.diagram.registerIntentSteps, ({ applyAction }) => {
      it('add unique intent step IDs on diagram', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          diagramID: DIAGRAM_ID,
          intentSteps: [
            { stepID: 'foo', intent: null },
            { stepID: STEP_ID, intent: null },
          ],
        });

        expect(result.byKey[DIAGRAM_ID].intentStepIDs).to.eql([...DIAGRAM.intentStepIDs, 'foo']);
      });

      it('update intent step lookup', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          diagramID: DIAGRAM_ID,
          intentSteps: [
            { stepID: 'foo', intent: { intentID: 'fizz', global: false } },
            { stepID: STEP_ID, intent: { intentID: 'buzz', global: true } },
          ],
        });

        expect(result.intentSteps[DIAGRAM_ID]).to.eql({
          foo: { intentID: 'fizz', global: false },
          [STEP_ID]: { intentID: 'buzz', global: true },
        });
      });

      it('add intent step lookup for new diagram', () => {
        const diagramID = 'otherDiagramID';
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          diagramID,
          intentSteps: [{ stepID: 'foo', intent: { intentID: 'bar', global: true } }],
        });

        expect(result.intentSteps[diagramID]).to.eql({ foo: { intentID: 'bar', global: true } });
      });
    });
  });
});
