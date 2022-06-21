import { AlexaProject } from '@voiceflow/alexa-types';
import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import * as Feature from '@/ducks/feature';
import * as Project from '@/ducks/projectV2';

import suite from './_suite';

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

const PROJECT_MEMBER: BaseModels.Project.Member<AlexaProject.MemberPlatformData> = {
  creatorID: CREATOR_ID,
  platformData: {
    selectedVendor: VENDOR_ID,
    vendors: [VENDOR],
  },
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
  platform: VoiceflowConstants.PlatformType.ALEXA,
  linkType: BaseModels.Project.LinkType.STRAIGHT,
  locales: ['en-us', 'eu-sp'],
  members: [PROJECT_MEMBER],
  platformData: {},
  customThemes: [],
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
      platform: VoiceflowConstants.PlatformType.VOICEFLOW,
      linkType: BaseModels.Project.LinkType.CURVED,
      locales: [],
      members: [],
      platformData: {},
      customThemes: [],
    },
  },
  allKeys: [PROJECT_ID, 'abc'],
};

suite(Project, MOCK_STATE)('Ducks - Project V2', ({ expect, describeReducerV2, createState, ...utils }) => {
  describe('reducer', () => {
    utils.assertIgnoresOtherActions();
    utils.assertInitialState(Project.INITIAL_STATE);

    describeReducerV2(Realtime.project.alexa.updateVendor, ({ applyAction }) => {
      const vendorID = 'foo vendor';
      const skillID = 'bar skill';

      it('update the active vendor', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, creatorID: CREATOR_ID, vendorID: VENDOR_ID, skillID });

        expect(result.byKey[PROJECT_ID].members).to.containSubset([{ platformData: { selectedVendor: VENDOR_ID, vendors: [{ skillID }] } }]);
      });

      it('append vendor if it does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, creatorID: CREATOR_ID, vendorID, skillID });

        expect(result.byKey[PROJECT_ID].members[0].platformData).to.eql({
          selectedVendor: vendorID,
          vendors: [VENDOR, { vendorID, skillID, products: {} }],
        });
      });

      it('do nothing if project does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, projectID: 'foo', creatorID: CREATOR_ID, vendorID: VENDOR_ID, skillID });

        expect(result).to.eq(MOCK_STATE);
      });

      it('do nothing if project member does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, creatorID: 1000, vendorID: VENDOR_ID, skillID });

        expect(result).to.eq(MOCK_STATE);
      });
    });
  });

  describe('selectors', () => {
    const v2FeatureState = { [Feature.STATE_KEY]: { features: {} } };

    describe('allProjectsSelector()', () => {
      it('select all projects', () => {
        const result = Project.allProjectsSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.eql([PROJECT, MOCK_STATE.byKey.abc]);
      });
    });

    describe('projectByIDSelector()', () => {
      it('select known project', () => {
        const result = Project.projectByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: PROJECT_ID });

        expect(result).to.eq(PROJECT);
      });

      it('select unknown project', () => {
        const result = Project.projectByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: 'foo' });

        expect(result).to.be.null;
      });
    });

    describe('projectsCountSelector()', () => {
      it('select count of projects', () => {
        const result = Project.projectsCountSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.eq(2);
      });
    });
  });
});
