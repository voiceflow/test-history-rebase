import * as Realtime from '@voiceflow/realtime-sdk';
import { generate } from '@voiceflow/ui';

import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as ProjectListV1 from '@/ducks/projectList';
import * as ProjectList from '@/ducks/projectListV2';

import suite from './_suite';

const WORKSPACE_ID = 'workspaceID';
const PROJECT_ID = 'projectID';
const LIST_ID = 'listID';
const ACTION_CONTEXT = { workspaceID: WORKSPACE_ID, listID: LIST_ID };

const PROJECT_LIST: Realtime.ProjectList = {
  id: LIST_ID,
  name: 'project list',
  projects: [PROJECT_ID, 'otherProjectID'],
};

const MOCK_STATE: ProjectList.ProjectListState = {
  byKey: {
    [LIST_ID]: PROJECT_LIST,
    abc: {
      id: 'abc',
      name: 'alphabet project list',
      projects: ['fizz', 'buzz'],
    },
  },
  allKeys: [LIST_ID, 'abc'],
};

suite(ProjectList, MOCK_STATE)('Ducks - Project List V2', ({ expect, describeReducerV2, createState, ...utils }) => {
  describe('reducer', () => {
    utils.assertIgnoresOtherActions();
    utils.assertInitialState(ProjectList.INITIAL_STATE);

    describeReducerV2(Realtime.projectList.addProjectToList, ({ applyAction }) => {
      it('add project to list', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, projectID: 'foo' });

        expect(result).to.containSubset({ byKey: { [LIST_ID]: { projects: [PROJECT_ID, 'otherProjectID', 'foo'] } } });
      });

      it('do nothing if project is already in list', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, projectID: PROJECT_ID });

        expect(result).to.eq(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.projectList.removeProjectFromList, ({ applyAction }) => {
      it('remove project from list', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, projectID: PROJECT_ID });

        expect(result).to.containSubset({ byKey: { [LIST_ID]: { projects: ['otherProjectID'] } } });
      });

      it('do nothing if project is not in list', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, projectID: 'foo' });

        expect(result).to.eq(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.projectList.transplantProjectBetweenLists, ({ applyAction }) => {
      it('reorder projects within list', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          from: { listID: LIST_ID, projectID: 'otherProjectID' },
          to: { listID: LIST_ID, target: PROJECT_ID },
        });

        expect(result.byKey[LIST_ID].projects).to.eql(['otherProjectID', PROJECT_ID]);
      });

      it('move project between lists by ID', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          from: { listID: 'abc', projectID: 'fizz' },
          to: { listID: LIST_ID, target: PROJECT_ID },
        });

        expect(result.byKey[LIST_ID].projects).to.eql(['fizz', PROJECT_ID, 'otherProjectID']);
        expect(result.byKey.abc.projects).to.eql(['buzz']);
      });

      it('move project between lists by index', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          from: { listID: 'abc', projectID: 'fizz' },
          to: { listID: LIST_ID, target: 1 },
        });

        expect(result.byKey[LIST_ID].projects).to.eql([PROJECT_ID, 'fizz', 'otherProjectID']);
        expect(result.byKey.abc.projects).to.eql(['buzz']);
      });

      it('do nothing if source list is unknown', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          from: { listID: 'foo', projectID: 'fizz' },
          to: { listID: LIST_ID, target: PROJECT_ID },
        });

        expect(result).to.eq(MOCK_STATE);
      });

      it('do nothing if target list is unknown', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          from: { listID: 'abc', projectID: 'fizz' },
          to: { listID: 'foo', target: PROJECT_ID },
        });

        expect(result).to.eq(MOCK_STATE);
      });

      it('do nothing if source project is unknown', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          from: { listID: LIST_ID, projectID: 'foo' },
          to: { listID: LIST_ID, target: PROJECT_ID },
        });

        expect(result).to.eq(MOCK_STATE);
      });

      it('move to front of list if target project is unknown', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          from: { listID: LIST_ID, projectID: PROJECT_ID },
          to: { listID: 'abc', target: 'foo' },
        });

        expect(result.byKey[LIST_ID].projects).to.eql(['otherProjectID']);
        expect(result.byKey.abc.projects).to.eql([PROJECT_ID, 'fizz', 'buzz']);
      });
    });
  });

  describe('selectors', () => {
    const v2FeatureState = { [Feature.STATE_KEY]: { features: { [FeatureFlag.ATOMIC_ACTIONS]: { isEnabled: true } } } };

    describe('allProjectListsSelector()', () => {
      it('select all project lists from the legacy store', () => {
        const projectLists = generate.array(3, () => ({ id: generate.id() }));

        const result = ProjectList.allProjectListsSelector(
          createState(MOCK_STATE, { [ProjectListV1.STATE_KEY]: Realtime.Utils.normalized.normalize(projectLists) })
        );

        expect(result).to.eql(projectLists);
      });

      it('select all project lists', () => {
        const result = ProjectList.allProjectListsSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.eql([PROJECT_LIST, MOCK_STATE.byKey.abc]);
      });
    });

    describe('projectListByIDSelector()', () => {
      it('select project list from the legacy store', () => {
        const projectList = { id: LIST_ID };
        const projectListState = Realtime.Utils.normalized.normalize([projectList]);

        const result = ProjectList.projectListByIDSelector(createState(MOCK_STATE, { [ProjectListV1.STATE_KEY]: projectListState }), { id: LIST_ID });

        expect(result).to.eq(projectList);
      });

      it('select known project list', () => {
        const result = ProjectList.projectListByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: LIST_ID });

        expect(result).to.eq(PROJECT_LIST);
      });

      it('select unknown project list', () => {
        const result = ProjectList.projectListByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: 'foo' });

        expect(result).to.be.null;
      });
    });

    describe('defaultProjectListSelector()', () => {
      it('has default project list', () => {
        const defaultProjectList = {
          id: 'foo',
          name: Realtime.DEFAULT_PROJECT_LIST_NAME,
          projects: [],
        };
        const mockState = Realtime.Utils.normalized.addNormalizedByKey(MOCK_STATE, 'foo', defaultProjectList);

        const result = ProjectList.defaultProjectListSelector(createState(mockState, v2FeatureState));

        expect(result).to.eq(defaultProjectList);
      });

      it('has no default project list', () => {
        const result = ProjectList.defaultProjectListSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.be.null;
      });
    });
  });
});
