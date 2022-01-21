import { Utils } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as IntentV1 from '@/ducks/intent';
import * as Intent from '@/ducks/intentV2';
import * as Project from '@/ducks/project';
import * as Session from '@/ducks/session';

import suite from './_suite';

const WORKSPACE_ID = 'workspaceID';
const PROJECT_ID = 'projectID';
const VERSION_ID = 'versionID';
const DIAGRAM_ID = 'diagramID';
const INTENT_ID = 'intentID';
const ACTION_CONTEXT = { workspaceID: WORKSPACE_ID, projectID: PROJECT_ID, versionID: VERSION_ID };

const INTENT: Realtime.Intent = {
  id: INTENT_ID,
  name: 'intent',
  platform: Constants.PlatformType.GENERAL,
  inputs: [],
  slots: {
    allKeys: [],
    byKey: {},
  },
};

const MOCK_STATE: Intent.IntentState = {
  byKey: {
    [INTENT_ID]: INTENT,
    abc: {
      id: 'abc',
      name: 'alphabet intent',
      platform: Constants.PlatformType.GOOGLE,
      inputs: [],
      slots: {
        allKeys: [],
        byKey: {},
      },
    },
  },
  allKeys: [INTENT_ID, 'abc'],
};

suite(Intent, MOCK_STATE)('Ducks - Intent V2', ({ expect, describeEffectV2, createState }) => {
  const v2FeatureState = { [Feature.STATE_KEY]: { features: { [FeatureFlag.ATOMIC_ACTIONS]: { isEnabled: true } } } };

  describe('selectors', () => {
    describe('allIntentsSelector()', () => {
      it('select all intents from the legacy store', () => {
        const intents = Utils.generate.array(3, () => ({ id: Utils.generate.id() }));

        const result = Intent.allIntentsSelector(createState(MOCK_STATE, { [IntentV1.STATE_KEY]: normalize(intents) }));

        expect(result).to.eql(intents);
      });

      it('select all intents', () => {
        const result = Intent.allIntentsSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.eql([INTENT, MOCK_STATE.byKey.abc]);
      });
    });

    describe('allIntentIDsSelector()', () => {
      it('select all intent IDs from the legacy store', () => {
        const intents = Utils.generate.array(3, () => ({ id: Utils.generate.id() }));

        const result = Intent.allIntentIDsSelector(createState(MOCK_STATE, { [IntentV1.STATE_KEY]: normalize(intents) }));

        expect(result).to.eql(intents.map((intent) => intent.id));
      });

      it('select all intent IDs', () => {
        const result = Intent.allIntentIDsSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.eq(MOCK_STATE.allKeys);
      });
    });

    describe('intentByIDSelector()', () => {
      it('select intent from the legacy store', () => {
        const intent = { id: INTENT_ID };
        const intentState = normalize([intent]);

        const result = Intent.intentByIDSelector(createState(MOCK_STATE, { [IntentV1.STATE_KEY]: intentState }), { id: INTENT_ID });

        expect(result).to.eq(intent);
      });

      it('select known intent', () => {
        const result = Intent.intentByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: INTENT_ID });

        expect(result).to.eq(INTENT);
      });

      it('select unknown intent', () => {
        const result = Intent.intentByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: 'foo' });

        expect(result).to.be.null;
      });
    });

    describe('getIntentByIDSelector()', () => {
      it('select intent from the legacy store', () => {
        const intent = { id: INTENT_ID };
        const intentState = normalize([intent]);

        const result = Intent.getIntentByIDSelector(createState(MOCK_STATE, { [IntentV1.STATE_KEY]: intentState }))(INTENT_ID);

        expect(result).to.eq(intent);
      });

      it('select known intent', () => {
        const result = Intent.getIntentByIDSelector(createState(MOCK_STATE, v2FeatureState))(INTENT_ID);

        expect(result).to.eq(INTENT);
      });

      it('select unknown intent', () => {
        const result = Intent.getIntentByIDSelector(createState(MOCK_STATE, v2FeatureState))('foo');

        expect(result).to.be.null;
      });
    });

    describe('intentsByIDsSelector()', () => {
      it('select intents from the legacy store', () => {
        const intent = { id: DIAGRAM_ID };
        const otherIntentID = 'foo';
        const otherIntent = { id: 'foo' };
        const intentState = normalize([otherIntent, intent]);

        const result = Intent.intentsByIDsSelector(createState(MOCK_STATE, { [IntentV1.STATE_KEY]: intentState }), {
          ids: [DIAGRAM_ID, otherIntentID],
        });

        expect(result).to.eql([intent, otherIntent]);
      });

      it('select known intents', () => {
        const result = Intent.intentsByIDsSelector(createState(MOCK_STATE, v2FeatureState), { ids: ['abc', INTENT_ID] });

        expect(result).to.eql([MOCK_STATE.byKey.abc, INTENT]);
      });

      it('select unknown intents', () => {
        const result = Intent.intentsByIDsSelector(createState(MOCK_STATE, v2FeatureState), { ids: ['foo', INTENT_ID] });

        expect(result).to.eql([INTENT]);
      });
    });
  });

  describe('side effects', () => {
    describeEffectV2(IntentV1.addManyIntents, 'addManyIntents()', ({ applyEffect }) => {
      it('add many intents locally', async () => {
        const { dispatched } = await applyEffect(createState(MOCK_STATE), [INTENT]);

        expect(dispatched).to.eql([IntentV1.crud.addMany([INTENT])]);
      });

      it('add many intents in realtime', async () => {
        const rootState = createState(MOCK_STATE, {
          ...v2FeatureState,
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
        });

        const { dispatched } = await applyEffect(rootState, [INTENT]);

        expect(dispatched).to.eql([{ sync: Realtime.intent.crud.addMany({ ...ACTION_CONTEXT, values: [INTENT] }) }]);
      });
    });

    describeEffectV2(IntentV1.replaceIntents, 'replaceIntents()', ({ applyEffect }) => {
      const createSlot = (id: string) => ({
        id,
        required: false,
        dialog: {
          confirm: [],
          confirmEnabled: false,
          prompt: [],
          utterances: [],
        },
      });

      it('replace intents locally', async () => {
        const projectID = 'projectID';
        const platform = Constants.PlatformType.GOOGLE;
        const rootState = createState(MOCK_STATE, {
          [Session.STATE_KEY]: { activeProjectID: projectID },
          [Project.STATE_KEY]: { byKey: { [projectID]: { platform } } },
        });

        const { dispatched } = await applyEffect(rootState, [INTENT]);

        expect(dispatched).to.eql([IntentV1.crud.replace([INTENT])]);
      });

      it('process intent slots before replacing locally', async () => {
        const projectID = 'projectID';
        const platform = Constants.PlatformType.GOOGLE;
        const rootState = createState(MOCK_STATE, {
          [Session.STATE_KEY]: { activeProjectID: projectID },
          [Project.STATE_KEY]: { byKey: { [projectID]: { platform } } },
        });
        const intent = {
          ...INTENT,
          inputs: [{ slots: ['foo', 'bar'] }, { slots: ['foo', 'fizz'] }, { slots: ['bar', 'buzz'] }],
          slots: null as any,
        } as Realtime.Intent;

        const { dispatched } = await applyEffect(rootState, [intent]);

        expect(dispatched).to.eql([
          IntentV1.crud.replace([
            {
              ...intent,
              slots: normalize([createSlot('foo'), createSlot('bar'), createSlot('fizz'), createSlot('buzz')]),
            },
          ]),
        ]);
      });

      it('do nothing if atomic actions enabled', async () => {
        const { dispatched } = await applyEffect(createState(MOCK_STATE, v2FeatureState), [INTENT]);

        expect(dispatched).to.be.empty;
      });
    });

    describeEffectV2(IntentV1.deleteIntent, 'deleteIntent()', ({ applyEffect }) => {
      it('remove intent locally', async () => {
        const { dispatched } = await applyEffect(createState(MOCK_STATE), INTENT_ID);

        expect(dispatched).to.eql([IntentV1.crud.remove(INTENT_ID)]);
      });

      it('remove intent in realtime', async () => {
        const rootState = createState(MOCK_STATE, {
          ...v2FeatureState,
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
        });

        const { dispatched } = await applyEffect(rootState, INTENT_ID);

        expect(dispatched).to.eql([{ sync: Realtime.intent.crud.remove({ ...ACTION_CONTEXT, key: INTENT_ID }) }]);
      });
    });
  });
});
