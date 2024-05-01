import { BaseNode, BaseVersion } from '@voiceflow/base-types';
import type * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { describe, expect, it } from 'vitest';

import * as Version from '@/ducks/versionV2';

import { createDuckTools } from '../_suite';

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

const { createState, describeReducer } = createDuckTools(Version, MOCK_STATE);

describe('Ducks - Version V2', () => {
  describe('reducer', () => {
    describeReducer(Realtime.version.variable.addGlobal, ({ applyAction }) => {
      it('append new variable', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'foo' });

        expect(result.byKey[VERSION_ID].variables).toEqual(['fizz', 'buzz', 'foo']);
      });

      it('do nothing if variable already exists', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'fizz' });

        expect(result).toBe(MOCK_STATE);
      });
    });

    describeReducer(Realtime.version.variable.removeGlobal, ({ applyAction }) => {
      it('remove a known variable', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'fizz' });

        expect(result.byKey[VERSION_ID].variables).toEqual(['buzz']);
      });

      it('do nothing if variable does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, variable: 'foo' });

        expect(result).toBe(MOCK_STATE);
      });
    });

    describeReducer(Realtime.version.patchPublishing, ({ applyAction }) => {
      it('partially update publishing data', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, publishing: { abc: 'def' } as any });

        expect(result.byKey[VERSION_ID].publishing).toEqual({ foo: 'bar', abc: 'def' });
      });

      it('do nothing if version does not exist', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          versionID: 'foo',
          publishing: { abc: 'def' } as any,
        });

        expect(result).toBe(MOCK_STATE);
      });
    });

    describeReducer(Realtime.version.patchSettings, ({ applyAction }) => {
      it('partially update settings data', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, settings: { defaultVoice: 'foo' as any } });

        expect(result.byKey[VERSION_ID].settings).toContain({ defaultVoice: 'foo' });
      });

      it('do nothing if version does not exist', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          versionID: 'foo',
          settings: { defaultVoice: 'foo' as any },
        });

        expect(result).toBe(MOCK_STATE);
      });
    });

    describeReducer(Realtime.version.patchSession, ({ applyAction }) => {
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
});
