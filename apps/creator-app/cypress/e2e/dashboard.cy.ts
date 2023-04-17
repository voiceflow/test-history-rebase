import { ClassName, DashboardClassName, Identifier } from '../../src/styles/constants';
import canvasPage from '../pages/canvas';
import menuComponent from '../pages/components/menu';
import dashboardPage from '../pages/dashboard';
import { collaboratorsModal, modal, paymentModal } from '../pages/modals';
import newWorkspacePage from '../pages/newWorkspace';
import { getClass, getIdentifier } from '../pages/utils';

context.skip('Team Dashboard', () => {
  beforeEach(() => cy.setup());
  afterEach(() => cy.teardown());

  it('show new workspace prompt', () => {
    cy.visit('/');
    cy.shouldBeOn(newWorkspacePage);
    newWorkspacePage.el.newWorkspaceButton.should('be.visible');
  });

  describe('dashboard interactions', () => {
    beforeEach(() => {
      cy.setup();
      cy.createProject();
      cy.visit('/');
    });
    afterEach(() => cy.teardown());

    it('go to existing project', () => {
      dashboardPage.el.projectListItemTitle.should('have.text', 'my other project');
      dashboardPage.el.projectListItem.click();
      canvasPage.el.projectTitle.should('have.text', 'my other project');
      cy.title().should('eq', 'my other project');
    });

    it('delete project', () => {
      dashboardPage.el.projectListItemTitle.should('have.text', 'my other project');
      dashboardPage.el.projectListItem.find('div').eq(1).realHover().find('.vf-svg-icon--ellipsis').should('be.visible').click();
      menuComponent.el.item.eq(8).should('have.text', 'Delete assistant').click();
      // modal(confirm).el.root.should('be.visible').find('button').eq(2).click();

      // check if last project in the list is removed
      // dashboardPage.el.projectList.should('have.length', 0);
      // dashboardPage.el.newProjectButton.should('be.visible');
    });

    it('remove list', () => {
      dashboardPage.el.projectList.should('have.length', 1);
      dashboardPage.el.projectList.find(getClass(DashboardClassName.LIST_HEADER_ASIDE)).find('.vf-svg-icon--ellipsis').click();
      menuComponent.el.item.eq(0).should('have.text', 'Remove List').click();
      modal('confirm').el.root.should('be.visible').find('button').eq(2).click();

      // check if last project list is removed
      dashboardPage.el.projectList.should('have.length', 0);
      dashboardPage.el.newProjectButton.should('be.visible');
    });

    it('add new list', () => {
      dashboardPage.el.projectList.should('have.length', 1);
      dashboardPage.el.projectListsContainer.find('.vf-svg-icon--plus').click();
      dashboardPage.el.projectList.should('have.length', 2);
    });

    it('update project list name', () => {
      dashboardPage.el.projectList.should('have.length', 1);
      dashboardPage.el.projectListHeader
        .find(getClass(DashboardClassName.LIST_HEADER_TITLE))
        .focus()
        .type('{selectall}{backspace}')
        .type('My List')
        .blur();
      dashboardPage.el.projectListHeader.find(getClass(DashboardClassName.LIST_HEADER_TITLE)).should('have.value', 'My List');
    });

    it('search project with result', () => {
      dashboardPage.el.headerSecondaryNav.find('input').focus().type('my other project');
      dashboardPage.el.projectList.should('have.length', 1);
      dashboardPage.el.projectListItem.should('have.length', 1);
      dashboardPage.el.headerSecondaryNav.find('input').clear().type('my list');
      dashboardPage.el.projectList.should('have.length', 0);
      dashboardPage.el.projectListItem.should('have.length', 0);
    });

    it('seconday nav add collaborator button', () => {
      dashboardPage.el.headerSecondaryNav.find(getIdentifier(Identifier.ADD_COLLABORATORS)).click();
      collaboratorsModal.el.root.should('be.visible');
    });

    it('show payment modal if starter', () => {
      dashboardPage.el.headerPrimaryNav.find(getClass(DashboardClassName.PLAN_BUBBLE)).should('have.text', 'Free');
      dashboardPage.el.headerPrimaryNav.find(getClass(ClassName.HEADER_ACTIONS_CENTER)).should('be.visible').click();
      paymentModal.el.root.should('be.visible');
    });

    it('show manage collaborator modal', () => {
      dashboardPage.el.headerPrimaryNav.find(getClass(ClassName.HEADER_ACTIONS_RIGHT)).should('be.visible');
      dashboardPage.el.headerPrimaryNav.find(getClass(ClassName.HEADER_ACTIONS_RIGHT)).find('.vf-svg-icon--cog').click();
      menuComponent.el.item.eq(0).should('have.text', 'Manage Collaborators').click();
      collaboratorsModal.el.root.should('be.visible');
    });
  });
});
