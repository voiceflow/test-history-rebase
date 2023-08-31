import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import * as Intent from '@/ducks/intentV2';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';

import suite from './_suite';

const WORKSPACE_ID = 'workspaceID';
const PROJECT_ID = 'projectID';
const VERSION_ID = 'versionID';
const INTENT_ID = 'intentID';
const ACTION_CONTEXT = { workspaceID: WORKSPACE_ID, projectID: PROJECT_ID, versionID: VERSION_ID };

const INTENT: Platform.Base.Models.Intent.Model = {
  id: INTENT_ID,
  name: 'intent',
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
      inputs: [],
      slots: {
        allKeys: [],
        byKey: {},
      },
    },
  },
  allKeys: [INTENT_ID, 'abc'],
};

suite(Intent, MOCK_STATE)('Ducks - Intent V2', ({ describeEffectV2, createState }) => {
  describe('selectors', () => {
    describe('allIntentsSelector()', () => {
      it('select all intents', () => {
        const result = Intent.allIntentsSelector(createState(MOCK_STATE));

        expect(result).toEqual([INTENT, MOCK_STATE.byKey.abc]);
      });
    });

    describe('allIntentIDsSelector()', () => {
      it('select all intent IDs', () => {
        const result = Intent.allIntentIDsSelector(createState(MOCK_STATE));

        expect(result).toBe(MOCK_STATE.allKeys);
      });
    });

    describe('intentByIDSelector()', () => {
      it('select known intent', () => {
        const result = Intent.intentByIDSelector(createState(MOCK_STATE), { id: INTENT_ID });

        expect(result).toBe(INTENT);
      });

      it('select unknown intent', () => {
        const result = Intent.intentByIDSelector(createState(MOCK_STATE), { id: 'foo' });

        expect(result).toBeNull();
      });
    });

    describe('intentsByIDsSelector()', () => {
      it('select known intents', () => {
        const result = Intent.intentsByIDsSelector(createState(MOCK_STATE), { ids: ['abc', INTENT_ID] });

        expect(result).toEqual([MOCK_STATE.byKey.abc, INTENT]);
      });

      it('select unknown intents', () => {
        const result = Intent.intentsByIDsSelector(createState(MOCK_STATE), { ids: ['foo', INTENT_ID] });

        expect(result).toEqual([INTENT]);
      });
    });

    describe('intentsUsingSlotSelector()', () => {
      it('should select intents using a slot by ID', () => {
        const slotID = Utils.generate.id();
        const otherSlots = Utils.generate.array(3, () => ({ id: Utils.generate.id() }));
        const intentWithSlot = Utils.generate.array(3, () => ({
          id: Utils.generate.id(),
          slots: normalize([{ id: slotID }, ...otherSlots]),
        }));
        const intentWithoutSlot = Utils.generate.array(3, () => ({
          id: Utils.generate.id(),
          slots: normalize(otherSlots),
        }));

        expect(
          Intent.intentsUsingSlotSelector(createState(MOCK_STATE, { [Intent.STATE_KEY]: normalize([...intentWithSlot, ...intentWithoutSlot]) }), {
            id: slotID,
          })
        ).toEqual(intentWithSlot);
      });
    });
  });

  describe('side effects', () => {
    describeEffectV2(Intent.addManyIntents, 'addManyIntents()', ({ applyEffect }) => {
      it('add many intents in realtime', async () => {
        const rootState = createState(MOCK_STATE, {
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
        });

        const { dispatched } = await applyEffect(rootState, [INTENT], Tracking.CanvasCreationType.EDITOR);

        expect(dispatched).toEqual([
          {
            sync: Realtime.intent.crud.addMany({
              ...ACTION_CONTEXT,
              values: [INTENT],
              projectMeta: {
                nlu: Platform.Constants.NLUType.VOICEFLOW,
                platform: Platform.Constants.PlatformType.VOICEFLOW,
                type: Platform.Constants.ProjectType.VOICE,
              },
            }),
          },
        ]);
      });
    });

    describeEffectV2(Intent.deleteIntent, 'deleteIntent()', ({ applyEffect }) => {
      it('remove intent in realtime', async () => {
        const rootState = createState(MOCK_STATE, {
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
        });

        const { dispatched } = await applyEffect(rootState, INTENT_ID);

        expect(dispatched).toEqual([
          {
            sync: Realtime.intent.crud.remove({
              ...ACTION_CONTEXT,
              key: INTENT_ID,
              projectMeta: {
                nlu: Platform.Constants.NLUType.VOICEFLOW,
                platform: Platform.Constants.PlatformType.VOICEFLOW,
                type: Platform.Constants.ProjectType.VOICE,
              },
            }),
          },
        ]);
      });
    });
  });
});
