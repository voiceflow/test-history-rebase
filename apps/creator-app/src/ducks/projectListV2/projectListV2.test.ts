import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';
import { describe, expect, it } from 'vitest';

import { createDuckTools } from '@/ducks/_suite';
import * as Feature from '@/ducks/feature';

import * as ProjectList from '.';

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

const { createState, describeReducer, ...utils } = createDuckTools(ProjectList, MOCK_STATE);

describe('Ducks - Project List V2', () => {
  describe('reducer', () => {
    utils.assertIgnoresOtherActions();
    utils.assertInitialState(ProjectList.INITIAL_STATE);

    describeReducer(Realtime.projectList.addProjectToList, ({ applyAction }) => {
      it('add project to list', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, projectID: 'foo' });

        expect(result.byKey[LIST_ID].projects).toEqual(['foo', PROJECT_ID, 'otherProjectID']);
      });

      it('do nothing if project is already in list', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, projectID: PROJECT_ID });

        expect(result).toBe(MOCK_STATE);
      });
    });

    describeReducer(Realtime.projectList.removeProjectFromList, ({ applyAction }) => {
      it('remove project from list', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, projectID: PROJECT_ID });

        expect(result.byKey[LIST_ID].projects).toEqual(['otherProjectID']);
      });

      it('do nothing if project is not in list', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, projectID: 'foo' });

        expect(result).toBe(MOCK_STATE);
      });
    });

    describeReducer(Realtime.projectList.transplantProjectBetweenLists, ({ applyAction }) => {
      it('reorder projects within list', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          from: { listID: LIST_ID, projectID: 'otherProjectID' },
          to: { listID: LIST_ID, index: 0 },
        });

        expect(result.byKey[LIST_ID].projects).toEqual(['otherProjectID', PROJECT_ID]);
      });

      it('move project between lists by index', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          from: { listID: 'abc', projectID: 'fizz' },
          to: { listID: LIST_ID, index: 0 },
        });

        expect(result.byKey[LIST_ID].projects).toEqual(['fizz', PROJECT_ID, 'otherProjectID']);
        expect(result.byKey.abc.projects).toEqual(['buzz']);
      });

      it('do nothing if source list is unknown', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          from: { listID: 'foo', projectID: 'fizz' },
          to: { listID: LIST_ID, index: 0 },
        });

        expect(result).toBe(MOCK_STATE);
      });

      it('do nothing if target list is unknown', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          from: { listID: 'abc', projectID: 'fizz' },
          to: { listID: 'foo', index: 0 },
        });

        expect(result).toBe(MOCK_STATE);
      });

      it('do nothing if source project is unknown', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          from: { listID: LIST_ID, projectID: 'foo' },
          to: { listID: LIST_ID, index: 0 },
        });

        expect(result).toBe(MOCK_STATE);
      });

      it('move to front of list if target project is unknown', () => {
        const result = applyAction(MOCK_STATE, {
          ...ACTION_CONTEXT,
          from: { listID: LIST_ID, projectID: PROJECT_ID },
          to: { listID: 'abc', index: -1 },
        });

        expect(result.byKey[LIST_ID].projects).toEqual(['otherProjectID']);
        expect(result.byKey.abc.projects).toEqual([PROJECT_ID, 'fizz', 'buzz']);
      });
    });
  });

  describe('selectors', () => {
    const v2FeatureState = { [Feature.STATE_KEY]: { features: {} } };

    describe('allProjectListsSelector()', () => {
      it('select all project lists', () => {
        const result = ProjectList.allProjectListsSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).toEqual([PROJECT_LIST, MOCK_STATE.byKey.abc]);
      });
    });

    describe('projectListByIDSelector()', () => {
      it('select known project list', () => {
        const result = ProjectList.projectListByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: LIST_ID });

        expect(result).toBe(PROJECT_LIST);
      });

      it('select unknown project list', () => {
        const result = ProjectList.projectListByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: 'foo' });

        expect(result).toBeNull();
      });
    });

    describe('defaultProjectListSelector()', () => {
      it('has default project list', () => {
        const defaultProjectList = {
          id: 'foo',
          name: Realtime.DEFAULT_PROJECT_LIST_NAME,
          projects: [],
        };
        const mockState = Normal.appendOne(MOCK_STATE, 'foo', defaultProjectList);

        const result = ProjectList.defaultProjectListSelector(createState(mockState, v2FeatureState));

        expect(result).toBe(defaultProjectList);
      });

      it('has no default project list', () => {
        const result = ProjectList.defaultProjectListSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).toBeNull();
      });
    });
  });
});
