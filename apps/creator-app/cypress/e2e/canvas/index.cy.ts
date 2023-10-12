import canvasPage from '../../pages/canvas';
import sharedPage from '../../pages/shared';

context.skip('Canvas', () => {
  beforeEach(() => {
    cy.setup();
    cy.createProject();
    canvasPage.goToCanvas();
  });
  afterEach(() => cy.teardown());

  it('opens canvas', () => {
    cy.shouldBeOn(canvasPage);
    cy.awaitLoaded();
  });

  it('open settings', () => {
    cy.awaitLoaded();
    canvasPage.el.tabs.settingsTab.click();
    canvasPage.el.settingsPage.should('have.length', 1);
  });

  it('shows info message when saving via hotkey', () => {
    cy.awaitCanvasAnimation();

    canvasPage.el.canvas.sendHotkey('{meta}s');

    sharedPage.el.toastify.should('contain', 'Voiceflow automatically saves your work');
  });

  it('drag canvas', () => {
    cy.awaitCanvasAnimation();

    canvasPage.el.canvasOffset.should('have.coords', [112, 153]);

    cy.dragCanvas(200, -20);

    canvasPage.el.canvasOffset.should('have.coords', [312, 133]);
  });
});
