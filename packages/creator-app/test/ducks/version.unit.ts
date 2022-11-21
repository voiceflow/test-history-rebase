/* eslint-disable sonarjs/no-duplicate-string, mocha/no-identical-title */
import { BaseNode, BaseVersion } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Session from '@/ducks/session';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import * as VersionV1 from '@/ducks/version';
import * as Version from '@/ducks/versionV2';

import suite from './_suite';

const WORKSPACE_ID = 'workspaceID';
const PROJECT_ID = 'projectID';
const VERSION_ID = 'versionID';
const DIAGRAM_ID = 'diagramID';
const CREATOR_ID = 999;
const ACTION_CONTEXT = { workspaceID: WORKSPACE_ID, projectID: PROJECT_ID, versionID: VERSION_ID };

const VERSION: Platform.Base.Models.Version.Model = {
  id: VERSION_ID,
  projectID: PROJECT_ID,
  creatorID: CREATOR_ID,
  rootDiagramID: DIAGRAM_ID,
  status: null,
  variables: ['fizz', 'buzz'],
  topics: [],
  components: [],
  folders: {},
  session: {
    restart: false,
    resumePrompt: {
      voice: null,
      followVoice: null,
      content: 'hello, world!',
      followContent: 'follow me!',
    },
  },
  settings: {
    defaultVoice: null,
    error: null,
    repeat: BaseVersion.RepeatType.DIALOG,
    defaultCanvasNodeVisibility: BaseNode.Utils.CanvasNodeVisibility.PREVIEW,
    defaultCarouselLayout: BaseNode.Carousel.CarouselLayout.CAROUSEL,
  },
  publishing: {
    foo: 'bar',
  } as any,
};

const MOCK_STATE: Version.VersionState = {
  byKey: {
    [VERSION_ID]: VERSION,
  },
  allKeys: [VERSION_ID],
};

suite(Version, MOCK_STATE)('Ducks - Version V2', ({ describeReducerV2, describeEffectV2, createState }) => {
  describe('reducer', () => {
    describeReducerV2(Realtime.version.variable.addGlobal, ({ applyAction }) => {
      it('append new variable', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'foo' });

        expect(result.byKey[VERSION_ID].variables).toEqual(['fizz', 'buzz', 'foo']);
      });

      it('do nothing if variable already exists', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'fizz' });

        expect(result).toBe(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.version.variable.removeGlobal, ({ applyAction }) => {
      it('remove a known variable', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'fizz' });

        expect(result.byKey[VERSION_ID].variables).toEqual(['buzz']);
      });

      it('do nothing if variable does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'foo' });

        expect(result).toBe(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.version.patchPublishing, ({ applyAction }) => {
      it('partially update publishing data', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, publishing: { abc: 'def' } as any });

        expect(result.byKey[VERSION_ID].publishing).toEqual({ foo: 'bar', abc: 'def' });
      });

      it('do nothing if version does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, versionID: 'foo', publishing: { abc: 'def' } as any });

        expect(result).toBe(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.version.patchSettings, ({ applyAction }) => {
      it('partially update settings data', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, settings: { defaultVoice: 'foo' as any } });

        expect(result.byKey[VERSION_ID].settings).toContain({ defaultVoice: 'foo' });
      });

      it('do nothing if version does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, versionID: 'foo', settings: { defaultVoice: 'foo' as any } });

        expect(result).toBe(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.version.patchSession, ({ applyAction }) => {
      it('partially update session data', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, session: { restart: true } });

        expect(result.byKey[VERSION_ID].session).toContain({ restart: true });
      });

      it('do nothing if version does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, versionID: 'foo', session: { restart: true } });

        expect(result).toBe(MOCK_STATE);
      });
    });
  });

  describe('selectors', () => {
    describe('versionByIDSelector()', () => {
      it('select known version', () => {
        const result = Version.versionByIDSelector(createState(MOCK_STATE), { id: VERSION_ID });

        expect(result).toBe(VERSION);
      });

      it('select unknown version', () => {
        const result = Version.versionByIDSelector(createState(MOCK_STATE), { id: 'foo' });

        expect(result).toBeNull();
      });
    });
  });

  describe('side effects', () => {
    describeEffectV2(VersionV1.addGlobalVariable, 'addGlobalVariable()', ({ applyEffect }) => {
      it('fail if variable name is reserved javascript keyword', async () => {
        const rootState = {
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
        };

        await expect(applyEffect(createState(MOCK_STATE, rootState), 'new', CanvasCreationType.IMM)).rejects.toThrow(
          "Reserved word. You can prefix with '_' to fix this issue"
        );
      });

      it('fail when adding an invalid variable', async () => {
        const rootState = {
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
        };

        await expect(applyEffect(createState(MOCK_STATE, rootState), '@$%!', CanvasCreationType.IMM)).rejects.toThrow(
          'Variable contains invalid characters or is greater than 64 characters'
        );
        await expect(applyEffect(createState(MOCK_STATE, rootState), 'xxxx-xxxx-xxxx-xxxx', CanvasCreationType.IMM)).rejects.toThrow(
          'Variable contains invalid characters or is greater than 64 characters'
        );
      });

      it('fail when adding variable to version locally if variable already exists', async () => {
        const rootState = {
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
        };

        await expect(applyEffect(createState(MOCK_STATE, rootState), 'fizz', CanvasCreationType.IMM)).rejects.toThrow('No duplicate variables: fizz');
      });

      it('add variable to version in realtime', async () => {
        const rootState = {
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
        };

        const { dispatched } = await applyEffect(createState(MOCK_STATE, rootState), 'foo', CanvasCreationType.IMM);

        expect(dispatched).toEqual([{ sync: Realtime.version.variable.addManyGlobal({ ...ACTION_CONTEXT, variables: ['foo'] }) }]);
      });
    });

    describeEffectV2(VersionV1.removeGlobalVariable, 'removeGlobalVariable()', ({ applyEffect }) => {
      it('remove variable from version in realtime', async () => {
        const rootState = {
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
        };

        const { dispatched } = await applyEffect(createState(MOCK_STATE, rootState), 'fizz');

        expect(dispatched).toEqual([{ sync: Realtime.version.variable.removeGlobal({ ...ACTION_CONTEXT, variable: 'fizz' }) }]);
      });
    });
  });
});
