import * as Realtime from '@voiceflow/realtime-sdk';
import { generate } from '@voiceflow/ui';
import { DeepPartial } from 'utility-types';

import client from '@/client';
import * as Feature from '@/ducks/feature';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import * as ProjectListV2 from '@/ducks/projectListV2';
import * as ProjectListSelectorsV2 from '@/ducks/projectListV2/selectors';
import { createCRUDState, CRUDState } from '@/ducks/utils/crud';
import * as Models from '@/models';
import { State } from '@/store/types';
import { normalize } from '@/utils/normalized';
import * as StringUtils from '@/utils/string';

import suite from './_suite';

const LIST_ID = generate.id();
const PROJECT_ID = generate.id();
const PROJECT_IDS = generate.array();
const LIST_NAME = generate.string();
const LIST = {
  id: LIST_ID,
  name: LIST_NAME,
  projects: [PROJECT_ID, ...PROJECT_IDS],
} as Models.ProjectList;
const MOCK_STATE: CRUDState<Models.ProjectList> = {
  byKey: {
    [LIST_ID]: LIST,
  },
  allKeys: [LIST_ID],
};
const ROOT_STATE: DeepPartial<State> = {
  [ProjectListV2.STATE_KEY]: createCRUDState(),
  [Feature.STATE_KEY]: {
    features: {},
  },
};

suite(ProjectList, MOCK_STATE)('Ducks - Project List', ({ expect, stub, describeCRUDReducer, describeSelectors, describeSideEffects }) => {
  describeCRUDReducer(({ expectAction, applyAction }) => {
    describe('crud', () => {
      describe('update()', () => {
        it('should rename the list', () => {
          const name = generate.string();

          expectAction(ProjectList.crud.patch(LIST_ID, { name })).toModifyByKey(LIST_ID, { name });
        });
      });
    });

    describe('removeProjectFromList()', () => {
      it('should remove project from list', () => {
        expectAction(ProjectList.removeProjectFromList(LIST_ID, PROJECT_ID)).toModifyByKey(LIST_ID, { projects: PROJECT_IDS });
      });
    });

    describe('addProjectToListAction()', () => {
      it('should add project to end of list', () => {
        const projectID = generate.id();

        expectAction(ProjectList.addProjectToListAction(LIST_ID, projectID)).toModifyByKey(LIST_ID, {
          projects: [...LIST.projects, projectID],
        });
      });

      it('should add project to start of list', () => {
        const projectID = generate.id();

        expectAction(ProjectList.addProjectToListAction(LIST_ID, projectID, true)).toModifyByKey(LIST_ID, {
          projects: [projectID, ...LIST.projects],
        });
      });
    });

    describe('transplantProject()', () => {
      it('should reorder project in list', () => {
        expectAction(
          ProjectList.transplantProject({ listID: LIST_ID, projectID: PROJECT_ID }, { listID: LIST_ID, target: PROJECT_IDS[2] })
        ).toModifyByKey(LIST_ID, { projects: [...PROJECT_IDS, PROJECT_ID] });
      });

      it('should reorder project in list by index', () => {
        expectAction(ProjectList.transplantProject({ listID: LIST_ID, projectID: PROJECT_ID }, { listID: LIST_ID, target: 1 })).toModifyByKey(
          LIST_ID,
          { projects: [PROJECT_IDS[0], PROJECT_ID, PROJECT_IDS[1], PROJECT_IDS[2]] }
        );
      });

      it('should move project between lists', () => {
        const listID = generate.id();
        const projectID = generate.id();
        const projectIDs = generate.array();
        const otherList = { id: listID, name: generate.string(), projects: [...projectIDs, projectID] };

        const state = applyAction(ProjectList.crud.add(listID, otherList));

        expectAction(ProjectList.transplantProject({ listID: LIST_ID, projectID: PROJECT_ID }, { listID, target: projectID }))
          .withState(state)
          .toModifyByKey(LIST_ID, { projects: PROJECT_IDS })
          .toModifyByKey(listID, { projects: [...projectIDs, PROJECT_ID, projectID] });
      });
    });
  });

  describeSelectors(({ select }) => {
    describe('defaultProjectListSelector()', () => {
      const otherLists = generate.array(3, () => ({ id: generate.id(), name: generate.string(), projects: generate.array() }));

      it('should select the default project list', () => {
        const defaultList = { id: generate.id(), name: Realtime.DEFAULT_PROJECT_LIST_NAME, projects: generate.array() };

        expect(
          select(ProjectListV2.defaultProjectListSelector, {
            ...ROOT_STATE,
            [ProjectList.STATE_KEY]: normalize([defaultList, ...otherLists]),
          })
        ).to.eq(defaultList);
      });

      it('should return null if none found', () => {
        expect(
          select(ProjectListV2.defaultProjectListSelector, {
            ...ROOT_STATE,
            [ProjectList.STATE_KEY]: normalize(otherLists),
          })
        ).to.be.null;
      });
    });
  });

  describeSideEffects(({ applyEffect, expectEffect }) => {
    const rootState = {
      ...ROOT_STATE,
      session: {},
    };

    describe('renameProjectList()', () => {
      it('should rename the list', async () => {
        const name = generate.string();

        await expectEffect(ProjectList.renameProjectList(LIST_ID, name), [ProjectList.crud.patch(LIST_ID, { name })], rootState);
      });
    });

    describe('addProjectToList()', () => {
      it('should add project to end of list', async () => {
        const projectID = generate.id();

        await expectEffect(ProjectList.addProjectToList(LIST_ID, projectID), [ProjectList.addProjectToListAction(LIST_ID, projectID)], rootState);
      });
    });

    describe('saveProjectListsForWorkspace()', () => {
      it('should save project lists to the DB', async () => {
        const workspaceID = generate.id();
        const lists: any[] = generate.array();
        const updateLists = stub(client.projectList, 'update');
        stub(ProjectListSelectorsV2, 'allProjectListsSelector').returns(lists);

        await applyEffect(ProjectList.saveProjectListsForWorkspace(workspaceID), { feature: { features: {} } });

        expect(updateLists).to.be.calledWithExactly(workspaceID, lists);
      });
    });

    describe('createProjectList()', () => {
      it('should create a new project list', async () => {
        const listID = generate.id();
        stub(StringUtils, 'cuid').returns(listID);

        const { result, expectDispatch } = await applyEffect(ProjectList.createProjectList(), rootState);

        expect(result.id).to.eq(listID);
        expectDispatch(ProjectList.crud.add(listID, { id: listID, name: 'New List', projects: [] }));
      });
    });

    describe('saveProjectToList()', () => {
      it('should add a project to project list in workspace', async () => {
        const lists: any[] = generate.array();
        const projectID = generate.id();
        const workspaceID = generate.id();
        const updateLists = stub(client.projectList, 'update');

        await applyEffect(ProjectList.saveProjectToList(workspaceID, [LIST, ...lists], projectID), rootState);

        expect(updateLists).to.be.calledWithExactly(workspaceID, [{ ...LIST, projects: [projectID, ...LIST.projects] }, ...lists]);
      });
    });

    describe('deleteProjectList()', () => {
      it('should remove a project list and all the projects in it', async () => {
        const deleteProject = stub(client.api.project, 'delete');

        await expectEffect(
          ProjectList.deleteProjectList(LIST_ID),
          [Project.crud.removeMany(LIST.projects), ProjectList.crud.remove(LIST_ID)],
          rootState
        );

        LIST.projects.forEach((projectID) => expect(deleteProject).to.be.calledWithExactly(projectID));
      });
    });

    describe('deleteProjectFromList()', () => {
      it('should the the projects in the list', async () => {
        const deleteProject = stub(client.api.project, 'delete');

        await expectEffect(
          ProjectList.deleteProjectFromList(LIST_ID, PROJECT_ID),
          [Project.crud.remove(PROJECT_ID), ProjectList.removeProjectFromList(LIST_ID, PROJECT_ID)],
          rootState
        );

        expect(deleteProject).to.be.calledWithExactly(PROJECT_ID);
      });
    });
  });
});
