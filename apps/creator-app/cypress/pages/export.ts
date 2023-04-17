import canvas from './canvas';

export default {
  goToExport: () => cy.getSession().then(({ versionID, diagramID }) => cy.visit(`/project/${versionID}/export/${diagramID}`)),

  el: canvas.el,

  meta: {
    route: /project\/.*\/export\/.*/,
  },
};
