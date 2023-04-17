import exportPage from '../pages/export';

context('Canvas Export', () => {
  beforeEach(() => {
    cy.setup();
    cy.createProject();
    exportPage.goToExport();
  });
  afterEach(() => cy.teardown());

  it('render with blocks', () => {
    exportPage.el.canvas.should('exist');

    exportPage.el.node.should('have.length', 1);
    exportPage.el.homeChip.should('be.visible');
  });
});
