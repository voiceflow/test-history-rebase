import canvas from './canvas';

export default {
  goToExport: () => cy.getSession().then(({ skillID, diagramID }) => cy.visit(`/project/${skillID}/export/${diagramID}`)),

  el: canvas.el,

  meta: {
    route: /project\/.*\/export\/.*/,
  },
};
