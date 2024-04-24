import type { Project, User } from '@voiceflow/cypress-common';
import {
  knowledgeBase,
  knowledgeBasePlainTextModal,
  knowledgeBaseSitemapUrlImportModal,
  knowledgeBaseUrlImportModal,
  previewKnowledgeBaseModal,
} from '@voiceflow/cypress-page-objects';

import { contentTestData } from '../../../support/testData/content';

describe('Content - Knowledge Base Import Types Validation', () => {
  let user: User;
  let project: Project;

  beforeEach(() => {
    cy.createUserWorkspaceAndProject({
      workspace: { plan: 'pro' },
      project: { file: 'empty.vf' },
    }).then((res) => {
      ({ user, project } = res);
      cy.authenticate(user);
      cy.visitPage(`/project/${project.devVersion}/cms/knowledge-base`);
    });
  });

  it('Should validate file upload import', () => {
    knowledgeBase.getBreadcrumbs().should('have.text', 'All data sources (0)');
    // Uploading various file types
    cy.uploadKBFile('mars.txt');
    cy.uploadKBFile('mars.pdf');
    cy.uploadKBFile('mars.docx');

    knowledgeBase.getPreviewButton().should('be.visible').click();
    previewKnowledgeBaseModal.getTextInput().type(contentTestData.kbQuestion);
    previewKnowledgeBaseModal.getResponseContent().should('contain.text', 'fourth planet');
    previewKnowledgeBaseModal.getSourceToggle().should('be.visible').click();
    previewKnowledgeBaseModal
      .getSourceDocumentLink()
      .should('contain.text', 'mars.txt')
      .should('contain.text', 'mars.pdf')
      .should('contain.text', 'mars.docx');
    previewKnowledgeBaseModal.getCloseButton().click();
  });

  it('Should validate plain text import', () => {
    knowledgeBase.getAddDataSourceButton().should('be.visible').click();
    knowledgeBase.getPlainTextLabel().should('be.visible').click();
    knowledgeBasePlainTextModal.getModal().should('be.visible');
    knowledgeBasePlainTextModal.getTextInput().type(contentTestData.kbPlainText).blur();
    knowledgeBasePlainTextModal.getImportButton().should('be.visible').click();
    cy.awaitLoaders();

    knowledgeBase.getPreviewButton().should('be.visible').click();
    previewKnowledgeBaseModal.getTextInput().type(contentTestData.kbQuestion2);
    previewKnowledgeBaseModal.getResponseContent().should('contain.text', 'Valles Marineris');
  });

  it('Should validate url import', () => {
    knowledgeBase.getAddDataSourceButton().should('be.visible').click();
    knowledgeBase.getURLsLabel().should('be.visible').click();
    knowledgeBaseUrlImportModal.getModal().should('be.visible');
    knowledgeBaseUrlImportModal.getUrlInput().type(contentTestData.kbURL).blur();
    knowledgeBaseUrlImportModal.getImportButton().should('be.visible').click();
    cy.awaitLoaders();

    knowledgeBase.getPreviewButton().should('be.visible').click();
    previewKnowledgeBaseModal.getTextInput().type(contentTestData.kbQuestion3);
    previewKnowledgeBaseModal.getResponseContent().should('contain.text', 'Nergal');
  });

  it('Should validate sitemap url import', () => {
    knowledgeBase.getAddDataSourceButton().should('be.visible').click();
    knowledgeBase.getSiteMapLabel().should('be.visible').click();
    knowledgeBaseSitemapUrlImportModal.getModal().should('be.visible');
    knowledgeBaseSitemapUrlImportModal.getSitemapInput().type(contentTestData.kbSiteMapUrl).blur();
    knowledgeBaseSitemapUrlImportModal.getContinueButton().should('be.visible').click();
    knowledgeBaseSitemapUrlImportModal.getModalTitle().should('contain.text', 'Review & confirm URLs');
    knowledgeBaseSitemapUrlImportModal.getImportButton().should('be.visible').should('contain.text', 'URLs').click();

    knowledgeBase.getPreviewButton().should('be.visible').click();
    previewKnowledgeBaseModal.getTextInput().type(contentTestData.kbQuestion4);
    previewKnowledgeBaseModal.getResponseContent().should('contain.text', 'Tim Hortons');
    previewKnowledgeBaseModal.getSourceDocumentLink().should('contain', 'https://www.timhortons.ca');
  });
});
