import * as Alexa from '@voiceflow/alexa-types';
import { Models as BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { generate } from '@voiceflow/ui';

import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as ProjectV1 from '@/ducks/project';
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

const VENDOR: Alexa.Project.Vendor = {
  vendorID: VENDOR_ID,
  skillID: SKILL_ID,
  products: {},
};

const PROJECT_MEMBER: BaseModels.Member<Alexa.Project.AlexaProjectMemberData> = {
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
  platform: Constants.PlatformType.ALEXA,
  linkType: BaseModels.ProjectLinkType.STRAIGHT,
  locales: ['en-us', 'eu-sp'],
  members: [PROJECT_MEMBER],
  platformData: {},
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
      platform: Constants.PlatformType.GENERAL,
      linkType: BaseModels.ProjectLinkType.CURVED,
      locales: [],
      members: [],
      platformData: {},
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

        expect(result).to.containSubset({
          byKey: { [PROJECT_ID]: { members: [{ platformData: { selectedVendor: VENDOR_ID, vendors: [{ skillID }] } }] } },
        });
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
    const v2FeatureState = { [Feature.STATE_KEY]: { features: { [FeatureFlag.ATOMIC_ACTIONS]: { isEnabled: true } } } };

    describe('allProjectsSelector()', () => {
      it('select all projects from the legacy store', () => {
        const projects = generate.array(3, () => ({ id: generate.id() }));

        const result = Project.allProjectsSelector(createState(MOCK_STATE, { [ProjectV1.STATE_KEY]: Utils.normalized.normalize(projects) }));

        expect(result).to.eql(projects);
      });

      it('select all projects', () => {
        const result = Project.allProjectsSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.eql([PROJECT, MOCK_STATE.byKey.abc]);
      });
    });

    describe('projectByIDSelector()', () => {
      it('select project from the legacy store', () => {
        const project = { id: PROJECT_ID };
        const projectState = Utils.normalized.normalize([project]);

        const result = Project.projectByIDSelector(createState(MOCK_STATE, { [ProjectV1.STATE_KEY]: projectState }), { id: PROJECT_ID });

        expect(result).to.eq(project);
      });

      it('select known project', () => {
        const result = Project.projectByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: PROJECT_ID });

        expect(result).to.eq(PROJECT);
      });

      it('select unknown project', () => {
        const result = Project.projectByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: 'foo' });

        expect(result).to.be.null;
      });
    });

    describe('getProjectByIDSelector()', () => {
      it('select project from the legacy store', () => {
        const project = { id: PROJECT_ID };
        const projectState = Utils.normalized.normalize([project]);

        const result = Project.getProjectByIDSelector(createState(MOCK_STATE, { [ProjectV1.STATE_KEY]: projectState }))(PROJECT_ID);

        expect(result).to.eq(project);
      });

      it('select known project', () => {
        const result = Project.getProjectByIDSelector(createState(MOCK_STATE, v2FeatureState))(PROJECT_ID);

        expect(result).to.eq(PROJECT);
      });

      it('select unknown project', () => {
        const result = Project.getProjectByIDSelector(createState(MOCK_STATE, v2FeatureState))('foo');

        expect(result).to.be.null;
      });
    });

    describe('projectsCountSelector()', () => {
      it('select count of projects from the legacy store', () => {
        const projects = generate.array(3, () => ({ id: generate.id() }));

        const result = Project.projectsCountSelector(createState(MOCK_STATE, { [ProjectV1.STATE_KEY]: Utils.normalized.normalize(projects) }));

        expect(result).to.eq(3);
      });

      it('select count of projects', () => {
        const result = Project.projectsCountSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.eq(2);
      });
    });
  });
});
