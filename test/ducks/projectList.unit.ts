import client from '@/client';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import * as ProjectListSelectors from '@/ducks/projectList/selectors';
import { CRUDState } from '@/ducks/utils/crud';
import * as Models from '@/models';
import { normalize } from '@/utils/normalized';
import * as StringUtils from '@/utils/string';
import { generate } from '@/utils/testing';

import suite from './_suite';

const LIST_ID = generate.id();
const PROJECT_ID = generate.id();
const PROJECT_IDS = generate.array();
const LIST_NAME = generate.string();
const LIST = {
  id: LIST_ID,
  name: LIST_NAME,
  projects: [PROJECT_ID, ...PROJECT_IDS],
  isNew: true,
} as Models.ProjectList;
const MOCK_STATE: CRUDState<Models.ProjectList> = {
  byKey: {
    [LIST_ID]: LIST,
  },
  allKeys: [LIST_ID],
};

suite(ProjectList, MOCK_STATE)('Ducks - Project List', ({ expect, stub, describeCRUDReducer, describeSelectors, describeSideEffects }) => {
  describeCRUDReducer(({ expectAction, applyAction }) => {
    describe('renameProjectList()', () => {
      it('should rename the list', () => {
        const name = generate.string();

        expectAction(ProjectList.renameProjectList(LIST_ID, name)).toModifyByKey(LIST_ID, { name });
      });
    });

    describe('clearNewProjectList()', () => {
      it('should clear the isNew flag', () => {
        expectAction(ProjectList.clearNewProjectList(LIST_ID)).toModifyByKey(LIST_ID, { isNew: false });
      });
    });

    describe('removeProjectFromList()', () => {
      it('should remove project from list', () => {
        expectAction(ProjectList.removeProjectFromList(LIST_ID, PROJECT_ID)).toModifyByKey(LIST_ID, { projects: PROJECT_IDS });
      });
    });

    describe('addProjectToList()', () => {
      it('should add project to end of list', () => {
        const projectID = generate.id();

        expectAction(ProjectList.addProjectToList(LIST_ID, projectID)).toModifyByKey(LIST_ID, { projects: [...LIST.projects, projectID] });
      });

      it('should add project to start of list', () => {
        const projectID = generate.id();

        expectAction(ProjectList.addProjectToList(LIST_ID, projectID, true)).toModifyByKey(LIST_ID, { projects: [projectID, ...LIST.projects] });
      });
    });

    describe('transplantProject()', () => {
      it('should reorder project in list', () => {
        expectAction(
          ProjectList.transplantProject({ listID: LIST_ID, projectID: PROJECT_ID }, { listID: LIST_ID, projectID: PROJECT_IDS[2] })
        ).toModifyByKey(LIST_ID, { projects: [...PROJECT_IDS, PROJECT_ID] });
      });

      it('should move project between lists', () => {
        const listID = generate.id();
        const projectID = generate.id();
        const projectIDs = generate.array();
        const otherList = { id: listID, name: generate.string(), projects: [...projectIDs, projectID] };

        const state = applyAction(ProjectList.addProjectList(listID, otherList));

        expectAction(ProjectList.transplantProject({ listID: LIST_ID, projectID: PROJECT_ID }, { listID, projectID }))
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
        const defaultList = { id: generate.id(), name: ProjectList.DEFAULT_LIST_NAME, projects: generate.array() };

        expect(
          select(ProjectList.defaultProjectListSelector, {
            [ProjectList.STATE_KEY]: normalize([defaultList, ...otherLists]),
          })
        ).to.eq(defaultList);
      });

      it('should return null if none found', () => {
        expect(
          select(ProjectList.defaultProjectListSelector, {
            [ProjectList.STATE_KEY]: normalize(otherLists),
          })
        ).to.be.null;
      });
    });
  });

  describeSideEffects(({ applyEffect, stubEffect }) => {
    describe('saveProjectListsForWorkspace()', () => {
      it('should save project lists to the DB', async () => {
        const workspaceID = generate.id();
        const lists: any[] = generate.array();
        const updateLists = stub(client.projectList, 'update');
        stub(ProjectListSelectors, 'allProjectListsSelector').returns(lists);

        await applyEffect(ProjectList.saveProjectListsForWorkspace(workspaceID));

        expect(updateLists).to.be.calledWithExactly(workspaceID, lists);
      });
    });

    describe('createNewList()', () => {
      it('should create a new project list', async () => {
        const listID = generate.id();
        stub(StringUtils, 'cuid').returns(listID);

        const { result, expectDispatch } = await applyEffect(ProjectList.createNewList());

        expect(result).to.eq(listID);
        expectDispatch(ProjectList.addProjectList(listID, { id: listID, name: 'New List', projects: [], isNew: true }));
      });
    });

    describe('addToListInWorkspace()', () => {
      it('should add a project to project list in workspace', async () => {
        const lists: any[] = generate.array();
        const projectID = generate.id();
        const workspaceID = generate.id();
        const updateLists = stub(client.projectList, 'update');

        await applyEffect(ProjectList.addToListInWorkspace(workspaceID, [LIST, ...lists], projectID));

        expect(updateLists).to.be.calledWithExactly(workspaceID, [{ ...LIST, projects: [projectID, ...LIST.projects] }, ...lists]);
      });
    });

    describe('deleteProjectList()', () => {
      it('should remove a project list and all the projects in it', async () => {
        const { dispatch } = await applyEffect(ProjectList.deleteProjectList(LIST_ID));

        expect(dispatch).to.be.calledWithExactly(ProjectList.removeProjectList(LIST_ID));
      });
    });

    describe('deleteProjectFromList()', () => {
      it('should the the projects in the list', async () => {
        const { dispatch } = await applyEffect(ProjectList.deleteProjectFromList(LIST_ID, PROJECT_ID));

        expect(dispatch).to.be.calledWithExactly(ProjectList.removeProjectFromList(LIST_ID, PROJECT_ID));
      });
    });
  });
});
