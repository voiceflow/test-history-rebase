import ssmlPage from '../pages/ssml';

context('SSML', () => {
  it('render SSML editor', () => {
    cy.visit('/ssml');

    cy.shouldBeOn(ssmlPage);

    ssmlPage.el.editor.should('be.visible');
  });
});
