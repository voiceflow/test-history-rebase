import type { AlexaProject } from '@voiceflow/alexa-types';
import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';
import { describe, expect, it } from 'vitest';

import { createDuckTools } from '@/ducks/_suite';
import * as Feature from '@/ducks/feature';

import * as Project from '.';

const WORKSPACE_ID = 'workspaceID';
const PROJECT_ID = 'projectID';
const VERSION_ID = 'versionID';
const DIAGRAM_ID = 'diagramID';
const VENDOR_ID = 'vendorID';
const SKILL_ID = 'skillID';
const CREATOR_ID = 999;
const ACTION_CONTEXT = { workspaceID: WORKSPACE_ID, projectID: PROJECT_ID };

const VENDOR: AlexaProject.Vendor = {
  vendorID: VENDOR_ID,
  skillID: SKILL_ID,
  products: {},
};

const PROJECT_PLATFORM_MEMBER: BaseModels.Project.Member<AlexaProject.MemberPlatformData> = {
  creatorID: CREATOR_ID,
  platformData: {
    selectedVendor: VENDOR_ID,
    vendors: [VENDOR],
  },
};

const DIAGRAM_VIEWER: Project.DiagramViewer = {
  creatorID: CREATOR_ID,
  creator_id: CREATOR_ID,
  name: 'alex',
  color: '#fff',
};

const PROJECT: Realtime.AnyProject = {
  workspaceID: WORKSPACE_ID,
  versionID: VERSION_ID,
  diagramID: DIAGRAM_ID,
  id: PROJECT_ID,
  name: 'project',
  image: 'http://example.com/image.png',
  module: '',
  created: '',
  isLive: true,
  platform: Platform.Constants.PlatformType.ALEXA,
  linkType: BaseModels.Project.LinkType.STRAIGHT,
  locales: ['en-us', 'eu-sp'],
  platformData: {},
  customThemes: [],
  platformMembers: Normal.normalize([PROJECT_PLATFORM_MEMBER], (member) => String(member.creatorID)),
};

const MOCK_STATE: Project.ProjectState = {
  byKey: {
    [PROJECT_ID]: PROJECT,
    abc: {
      workspaceID: WORKSPACE_ID,
      versionID: VERSION_ID,
      diagramID: DIAGRAM_ID,
      id: 'abc',
      name: 'alphabet project',
      image: 'http://example.com/alphabet.png',
      module: '',
      created: '',
      isLive: false,
      platform: Platform.Constants.PlatformType.VOICEFLOW,
      linkType: BaseModels.Project.LinkType.CURVED,
      locales: [],
      customThemes: [],
      platformData: {},
      platformMembers: Normal.createEmpty(),
    },
  },
  allKeys: [PROJECT_ID, 'abc'],

  awareness: {
    viewers: {
      [PROJECT_ID]: {
        [DIAGRAM_ID]: Normal.normalize(
          [DIAGRAM_VIEWER, { creatorID: 10, creator_id: 10, name: 'gray', color: '#777' }],
          (viewer) => String(viewer.creatorID)
        ),
        abc: Normal.normalize([{ creatorID: 1000, creator_id: 1000, name: 'caleb', color: '#aaa' }], (viewer) =>
          String(viewer.creatorID)
        ),
      },
    },
  },
};

const { createState, describeReducer, ...utils } = createDuckTools(Project, MOCK_STATE);

describe('Ducks - Project V2', () => {
  describe('reducer', () => {
    utils.assertIgnoresOtherActions();
    utils.assertInitialState(Project.INITIAL_STATE);

    describeReducer(Realtime.project.alexa.updateVendor, ({ applyAction }) => {
      const vendorID = 'foo vendor';
      const skillID = 'bar skill';

      it('update the active vendor', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          creatorID: CREATOR_ID,
          vendorID: VENDOR_ID,
          skillID,
        });

        expect(result.byKey[PROJECT_ID].platformMembers.byKey[CREATOR_ID]).toEqual(
          expect.objectContaining({
            platformData: { selectedVendor: VENDOR_ID, vendors: [{ skillID, products: {}, vendorID: 'vendorID' }] },
          })
        );
      });

      it('append vendor if it does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, creatorID: CREATOR_ID, vendorID, skillID });

        expect(result.byKey[PROJECT_ID].platformMembers.byKey[CREATOR_ID].platformData).toEqual({
          selectedVendor: vendorID,
          vendors: [VENDOR, { vendorID, skillID, products: {} }],
        });
      });

      it('do nothing if project does not exist', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          projectID: 'foo',
          creatorID: CREATOR_ID,
          vendorID: VENDOR_ID,
          skillID,
        });

        expect(result).toBe(MOCK_STATE);
      });

      it('do nothing if project member does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, creatorID: 1000, vendorID: VENDOR_ID, skillID });

        expect(result).toBe(MOCK_STATE);
      });
    });

    describeReducer(Realtime.project.awareness.updateDiagramViewers, ({ applyAction }) => {
      it('adds viewers to new diagram', () => {
        const diagramID = 'foo';

        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          diagramID,
          viewers: [{ creatorID: CREATOR_ID, name: 'bar' }],
        });

        expect(result.awareness.viewers).toEqual({
          ...MOCK_STATE.awareness.viewers,
          [PROJECT_ID]: {
            ...MOCK_STATE.awareness.viewers[PROJECT_ID],
            [diagramID]: Normal.normalize(
              [{ creatorID: CREATOR_ID, creator_id: CREATOR_ID, name: 'bar', color: '4A9B57|D0E9D5' }],
              (viewer) => String(viewer.creatorID)
            ),
          },
        });
      });

      it('replace viewers of known diagram', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          viewers: [{ creatorID: CREATOR_ID, name: 'bar' }],
          diagramID: DIAGRAM_ID,
        });

        expect(result.awareness.viewers[PROJECT_ID][DIAGRAM_ID]).toEqual(
          Normal.normalize(
            [{ creatorID: CREATOR_ID, creator_id: CREATOR_ID, name: 'bar', color: '4A9B57|D0E9D5' }],
            (viewer) => String(viewer.creatorID)
          )
        );
      });
    });

    describeReducer(Realtime.project.awareness.updateViewers, ({ applyAction }) => {
      it('updates viewers of all diagrams', () => {
        const diagramID = 'foo';

        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          viewers: {
            [DIAGRAM_ID]: [{ creatorID: 456, name: 'bar' }],
            [diagramID]: [{ creatorID: 789, name: 'cat' }],
          },
        });

        expect(result.awareness.viewers).toEqual({
          ...MOCK_STATE.awareness.viewers,
          [PROJECT_ID]: {
            ...MOCK_STATE.awareness.viewers[PROJECT_ID],
            [DIAGRAM_ID]: Normal.normalize(
              [{ creatorID: 456, creator_id: 456, name: 'bar', color: '4A9B57|D0E9D5' }],
              (viewer) => String(viewer.creatorID)
            ),
            [diagramID]: Normal.normalize(
              [{ creatorID: 789, creator_id: 789, name: 'cat', color: 'D6528A|FBDBEB' }],
              (viewer) => String(viewer.creatorID)
            ),
          },
        });
      });
    });
  });

  describe('selectors', () => {
    const v2FeatureState = { [Feature.STATE_KEY]: { features: {} } };

    describe('awarenessViewersSelector()', () => {
      it('select diagram viewers state', () => {
        expect(Project.awarenessViewersSelector(createState(MOCK_STATE))).toBe(MOCK_STATE.awareness.viewers);
      });
    });

    describe('allProjectsSelector()', () => {
      it('select all projects', () => {
        const result = Project.allProjectsSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).toEqual([PROJECT, MOCK_STATE.byKey.abc]);
      });
    });

    describe('projectByIDSelector()', () => {
      it('select known project', () => {
        const result = Project.projectByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: PROJECT_ID });

        expect(result).toBe(PROJECT);
      });

      it('select unknown project', () => {
        const result = Project.projectByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: 'foo' });

        expect(result).toBeNull();
      });
    });

    describe('projectsCountSelector()', () => {
      it('select count of projects', () => {
        const result = Project.projectsCountSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).toBe(2);
      });
    });
  });
});
