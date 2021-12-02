/* eslint-disable sonarjs/no-duplicate-string, mocha/no-identical-title */
import { Node, Version as BaseVersion } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import * as VersionV1 from '@/ducks/version';
import * as Version from '@/ducks/versionV2';

import suite from './_suite';

const WORKSPACE_ID = 'workspaceID';
const PROJECT_ID = 'projectID';
const VERSION_ID = 'versionID';
const DIAGRAM_ID = 'diagramID';
const CREATOR_ID = 999;
const ACTION_CONTEXT = { workspaceID: WORKSPACE_ID, projectID: PROJECT_ID, versionID: VERSION_ID };

const VERSION: Realtime.AnyVersion = {
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
    defaultCanvasNodeVisibility: Node.Utils.CanvasNodeVisibility.PREVIEW,
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

suite(Version, MOCK_STATE)('Ducks - Version V2', ({ expect, describeReducerV2, describeEffectV2, createState }) => {
  const v2FeatureState = { [Feature.STATE_KEY]: { features: { [FeatureFlag.ATOMIC_ACTIONS]: { isEnabled: true } } } };

  describe('reducer', () => {
    describeReducerV2(Realtime.version.addGlobalVariable, ({ applyAction }) => {
      it('append new variable', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'foo' });

        expect(result).to.containSubset({ byKey: { [VERSION_ID]: { variables: ['fizz', 'buzz', 'foo'] } } });
      });

      it('do nothing if variable already exists', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'fizz' });

        expect(result).to.eq(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.version.removeGlobalVariable, ({ applyAction }) => {
      it('remove a known variable', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'fizz' });

        expect(result).to.containSubset({ byKey: { [VERSION_ID]: { variables: ['buzz'] } } });
      });

      it('do nothing if variable does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'foo' });

        expect(result).to.eq(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.version.patchPublishing, ({ applyAction }) => {
      it('partially update publishing data', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, publishing: { abc: 'def' } as any });

        expect(result).to.containSubset({ byKey: { [VERSION_ID]: { publishing: { foo: 'bar', abc: 'def' } } } });
      });

      it('do nothing if version does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, versionID: 'foo', publishing: { abc: 'def' } as any });

        expect(result).to.eq(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.version.patchSettings, ({ applyAction }) => {
      it('partially update publishing data', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, settings: { defaultVoice: 'foo' as any } });

        expect(result).to.containSubset({ byKey: { [VERSION_ID]: { settings: { defaultVoice: 'foo' } } } });
      });

      it('do nothing if version does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, versionID: 'foo', settings: { defaultVoice: 'foo' as any } });

        expect(result).to.eq(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.version.patchSession, ({ applyAction }) => {
      it('partially update publishing data', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, session: { restart: true } });

        expect(result).to.containSubset({ byKey: { [VERSION_ID]: { session: { restart: true } } } });
      });

      it('do nothing if version does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, versionID: 'foo', session: { restart: true } });

        expect(result).to.eq(MOCK_STATE);
      });
    });
  });

  describe('selectors', () => {
    describe('versionByIDSelector()', () => {
      it('select version from the legacy store', () => {
        const version = { id: VERSION_ID };
        const versionState = Utils.normalized.normalize([version]);

        const result = Version.versionByIDSelector(createState(MOCK_STATE, { [VersionV1.STATE_KEY]: versionState }), { id: VERSION_ID });

        expect(result).to.eq(version);
      });

      it('select known version', () => {
        const result = Version.versionByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: VERSION_ID });

        expect(result).to.eq(VERSION);
      });

      it('select unknown version', () => {
        const result = Version.versionByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: 'foo' });

        expect(result).to.be.null;
      });
    });

    describe('getVersionByIDSelector()', () => {
      it('select version from the legacy store', () => {
        const version = { id: VERSION_ID };
        const versionState = Utils.normalized.normalize([version]);

        const result = Version.getVersionByIDSelector(createState(MOCK_STATE, { [VersionV1.STATE_KEY]: versionState }))(VERSION_ID);

        expect(result).to.eq(version);
      });

      it('select known version', () => {
        const result = Version.getVersionByIDSelector(createState(MOCK_STATE, v2FeatureState))(VERSION_ID);

        expect(result).to.eq(VERSION);
      });

      it('select unknown version', () => {
        const result = Version.getVersionByIDSelector(createState(MOCK_STATE, v2FeatureState))('foo');

        expect(result).to.be.null;
      });
    });
  });

  describe('side effects', () => {
    describeEffectV2(VersionV1.addGlobalVariable, 'addGlobalVariable()', ({ applyEffect }) => {
      it('add variable to version locally', async () => {
        const rootState = {
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
          [VersionV1.STATE_KEY]: Utils.normalized.normalize([{ id: VERSION_ID, variables: ['foo', 'bar'] }]),
        };

        const { dispatched } = await applyEffect(createState(MOCK_STATE, rootState), 'fizz');

        expect(dispatched).to.eql([VersionV1.crud.patch(VERSION_ID, { variables: ['foo', 'bar', 'fizz'] })]);
      });

      it('fail if variable name is reserved javascript keyword', async () => {
        const rootState = {
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
        };

        await expect(applyEffect(createState(MOCK_STATE, rootState), 'new')).to.be.rejectedWith(
          "Reserved word. You can prefix with '_' to fix this issue"
        );
      });

      it('fail when adding an invalid variable', async () => {
        const rootState = {
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
        };

        await expect(applyEffect(createState(MOCK_STATE, rootState), '@$%!')).to.be.rejectedWith(
          'Variable contains invalid characters or is greater than 64 characters'
        );
        await expect(applyEffect(createState(MOCK_STATE, rootState), 'xxxx-xxxx-xxxx-xxxx')).to.be.rejectedWith(
          'Variable contains invalid characters or is greater than 64 characters'
        );
      });

      it('fail when adding variable to version locally if variable already exists', async () => {
        const rootState = {
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
          [VersionV1.STATE_KEY]: Utils.normalized.normalize([{ id: VERSION_ID, variables: ['foo', 'bar'] }]),
        };

        await expect(applyEffect(createState(MOCK_STATE, rootState), 'foo')).to.be.rejectedWith('No duplicate variables: foo');
      });

      it('add variable to version in realtime', async () => {
        const rootState = {
          ...v2FeatureState,
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
        };

        const { dispatched } = await applyEffect(createState(MOCK_STATE, rootState), 'foo');

        expect(dispatched).to.eql([{ sync: Realtime.version.addGlobalVariable({ ...ACTION_CONTEXT, variable: 'foo' }) }]);
      });
    });

    describeEffectV2(VersionV1.removeGlobalVariable, 'removeGlobalVariable()', ({ applyEffect }) => {
      it('remove variable from version locally', async () => {
        const rootState = {
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
          [VersionV1.STATE_KEY]: Utils.normalized.normalize([{ id: VERSION_ID, variables: ['foo', 'bar'] }]),
        };

        const { dispatched } = await applyEffect(createState(MOCK_STATE, rootState), 'foo');

        expect(dispatched).to.eql([VersionV1.crud.patch(VERSION_ID, { variables: ['bar'] })]);
      });

      it('do nothing when removing variable from version locally if variable does not exist', async () => {
        const variables = ['foo', 'bar'];
        const rootState = {
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
          [VersionV1.STATE_KEY]: Utils.normalized.normalize([{ id: VERSION_ID, variables }]),
        };

        const { dispatched } = await applyEffect(createState(MOCK_STATE, rootState), 'fizz');

        expect(dispatched).to.eql([VersionV1.crud.patch(VERSION_ID, { variables })]);
      });

      it('remove variable from version in realtime', async () => {
        const rootState = {
          ...v2FeatureState,
          [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
        };

        const { dispatched } = await applyEffect(createState(MOCK_STATE, rootState), 'fizz');

        expect(dispatched).to.eql([{ sync: Realtime.version.removeGlobalVariable({ ...ACTION_CONTEXT, variable: 'fizz' }) }]);
      });
    });
  });
});
