import canvasPage from '../pages/canvas';
import dashboardPage from '../pages/dashboard';
import newProjectPage from '../pages/newProject';
import newWorkspacePage from '../pages/newWorkspace';

const PROJECT_NAME = 'my new project';

context('Team Dashboard', () => {
  beforeEach(() => cy.setup());
  afterEach(() => cy.teardown());

  it('show new workspace prompt', () => {
    cy.visit('/');

    cy.shouldBeOn(newWorkspacePage);

    newWorkspacePage.el.newWorkspaceButton.should('be.visible');
  });

  it.skip('create new project', () => {
    cy.visit('/');

    dashboardPage.el.newProjectButton.click();

    cy.shouldBeOn(newProjectPage);

    newProjectPage.setName(PROJECT_NAME);

    newProjectPage.el.activeRegionCheckbox.should('have.text', 'English (US)');

    newProjectPage.el.createProjectButton.click();

    cy.shouldBeOn(canvasPage);

    canvasPage.el.projectTitle.should('have.value', PROJECT_NAME);

    cy.title().should('eq', PROJECT_NAME);
  });

  it('go to existing project', () => {
    cy.createProject();

    cy.visit('/');

    dashboardPage.el.projectListItemTitle.should('have.text', 'my other project');

    dashboardPage.el.projectListItem.click();

    canvasPage.el.projectTitle.should('have.text', 'my other project');

    cy.title().should('eq', 'my other project');
  });
});
