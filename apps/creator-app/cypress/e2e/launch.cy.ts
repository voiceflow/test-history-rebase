import canvas from '../pages/canvas';
import alexa from '../pages/launch/alexa';
import { getCypressFilepathMock } from '../utils';

const COMPLETED_PROGRESS_INDICATOR = 'gs__is-filled';

context.skip('Launch', () => {
  beforeEach(() => cy.setup());
  afterEach(() => cy.teardown());

  describe('Alexa launch page', () => {
    beforeEach(() => {
      cy.createProject();
      cy.intercept('GET', '/v2/versions/**').as('loadLaunchTab');
      cy.intercept('POST', '/image/small_icon').as('uploadSmallIcon');
      cy.intercept('POST', '/image/large_icon').as('uploadLargeIcon');

      cy.intercept('GET', 'https://localhost:3002/testable-link.svg').as('alexaUploadReady');
    });

    it.skip('happy path', () => {
      canvas.goToCanvas();

      // $TODO - Need to upload at least once to submit the Launch page
      // canvas.el.uploadButton.click()

      // cy.wait('@alexaUploadReady', { timeout: 10000 });

      // publish.el.loginWithAmazon.click();

      canvas.el.tabs.launchTab.click();
      cy.wait('@loadLaunchTab');

      /// / 1 - Basic Skill Information
      // a - Fill in the display name
      const displayName = 'Cypress Skill';
      alexa.el.basicSkillInfo.displayName.clear();
      alexa.el.basicSkillInfo.displayName.type(displayName);
      alexa.el.basicSkillInfo.displayName.should('have.value', displayName);

      // b - Upload a large icon
      const filepath1 = 'cypress/fixtures/image.png';

      alexa.el.basicSkillInfo.largeIconUpload
        .selectFile({ contents: filepath1, fileName: filepath1, mimeType: 'image/png' }, { force: true })
        .should('have.value', getCypressFilepathMock(filepath1));

      alexa.el.basicSkillInfo.largeIconUpload
        .selectFile({ contents: filepath1, fileName: filepath1, mimeType: 'image/png' }, { force: true })
        .should('have.value', getCypressFilepathMock(filepath1));

      // c - Upload a small icon
      const filepath2 = 'cypress/fixtures/image2.png';

      alexa.el.basicSkillInfo.smallIconUpload
        .selectFile({ contents: filepath2, fileName: filepath2, mimeType: 'image/png' }, { force: true })
        .should('have.value', getCypressFilepathMock(filepath2));

      // d - Wait until the upload is done before proceeding
      cy.wait('@uploadLargeIcon');
      cy.wait('@uploadSmallIcon');

      // e - Go to the next section
      alexa.el.nextButton.click();

      // f - Make sure checkmark appears
      alexa.el.progressIndicators.eq(0).should('have.class', COMPLETED_PROGRESS_INDICATOR);

      /// / 2 - Skill Description
      const summary = 'Four to the floor; never seeing clear;';
      alexa.el.skillDescription.summary.type(summary);
      alexa.el.skillDescription.summary.should('have.value', summary);

      const description = `Vous les hommes êtes tous les mêmes.`;
      alexa.el.skillDescription.description.type(description);
      alexa.el.skillDescription.description.should('have.value', description);

      alexa.el.skillDescription.categoryToggle.click();
      alexa.el.skillDescription.categoryDropdown.eq(0).click();

      const keywords = 'Game,Sports,Video';
      alexa.el.skillDescription.keywords.type(keywords);
      alexa.el.skillDescription.keywords.should('have.value', keywords);

      alexa.el.nextButton.click();

      alexa.el.progressIndicators.eq(1).should('have.class', COMPLETED_PROGRESS_INDICATOR);

      /// / 3 - Skill Invocation
      alexa.el.skillInvocation.invocations.should('have.length', 1);

      const invocationName = 'Rosemary';
      alexa.el.skillInvocation.invocationName.type(invocationName);
      alexa.el.skillInvocation.invocationName.should('have.value', invocationName);

      const def = {
        invocation1: `open ${invocationName}`,
        invocation2: `start ${invocationName}`,
        invocation3: `launch ${invocationName}`,
      };

      alexa.el.skillInvocation.invocationName.blur();

      alexa.el.skillInvocation.invocations.should('have.length', 3);

      alexa.el.skillInvocation.invocations.eq(0).should('have.value', def.invocation1);
      alexa.el.skillInvocation.invocations.eq(1).should('have.value', def.invocation2);
      alexa.el.skillInvocation.invocations.eq(2).should('have.value', def.invocation3);

      alexa.el.skillInvocation.deleteButtons.eq(1).click();

      alexa.el.skillInvocation.invocations.should('have.length', 2);
      alexa.el.skillInvocation.invocations.eq(0).should('have.value', def.invocation1);
      alexa.el.skillInvocation.invocations.eq(1).should('have.value', def.invocation3);

      alexa.el.skillInvocation.addInvocationButton.click();

      const invocation1 = `open ${invocationName}`;
      const invocation2 = `sesame ${invocationName}`;
      const invocation3 = `sei no ${invocationName}`;

      alexa.el.skillInvocation.invocations.eq(0).clear().type(invocation1).should('have.value', invocation1);
      alexa.el.skillInvocation.invocations
        .eq(1)
        .type(invocation2)
        .should('have.value', def.invocation3 + invocation2);
      alexa.el.skillInvocation.invocations.eq(2).type(invocation3).should('have.value', invocation3);

      alexa.el.nextButton.click();

      alexa.el.progressIndicators.eq(2).should('have.class', COMPLETED_PROGRESS_INDICATOR);

      /// / 4 - Locales
      const ACTIVE_ATTR = 'data-active';
      const EN = 0;
      const DE = 2;
      const JP = 3;

      alexa.el.locales.buttonGroup.eq(EN).should('have.attr', ACTIVE_ATTR, 'true');
      for (let i = 1; i < alexa.el.locales.buttonGroup.children.length; i += 1) {
        alexa.el.locales.buttonGroup.eq(i).should('have.attr', ACTIVE_ATTR, 'false');
      }

      alexa.el.locales.buttonGroup.eq(DE).click();
      alexa.el.locales.buttonGroup.eq(JP).click();

      alexa.el.locales.buttonGroup.eq(EN).should('have.attr', ACTIVE_ATTR, 'true');
      alexa.el.locales.buttonGroup.eq(DE).should('have.attr', ACTIVE_ATTR, 'true');
      alexa.el.locales.buttonGroup.eq(JP).should('have.attr', ACTIVE_ATTR, 'true');

      alexa.el.locales.buttonGroup.eq(EN).click();
      alexa.el.locales.buttonGroup.eq(DE).click();
      alexa.el.locales.buttonGroup.eq(JP).click();

      alexa.el.locales.buttonGroup.eq(EN).should('have.attr', ACTIVE_ATTR, 'false');
      alexa.el.locales.buttonGroup.eq(DE).should('have.attr', ACTIVE_ATTR, 'false');
      alexa.el.locales.buttonGroup.eq(JP).should('have.attr', ACTIVE_ATTR, 'true');

      alexa.el.nextButton.click();

      alexa.el.progressIndicators.eq(3).should('have.class', COMPLETED_PROGRESS_INDICATOR);

      /// / 5 - Privacy and Terms
      const policyURL = 'https://policy.url.com';
      alexa.el.privacyAndTerms.privacyPolicy.clear().type(policyURL).should('have.value', policyURL);

      const termsURL = 'https://terms.url.com';
      alexa.el.privacyAndTerms.termsAndCond.clear().type(termsURL).should('have.value', termsURL);

      alexa.el.privacyAndTerms.toggle.click();
      alexa.el.privacyAndTerms.toggleValue.contains('YES');
      alexa.el.privacyAndTerms.toggle.click();
      alexa.el.privacyAndTerms.toggleValue.contains('NO');

      alexa.el.nextButton.click();

      alexa.el.progressIndicators.eq(4).should('have.class', COMPLETED_PROGRESS_INDICATOR);

      /// / 6 - Privacy and Compliance
      const checked = 'checked';
      alexa.el.privacyAndCompliance.purchaseRadioButtons.eq(0).should('not.have.attr', checked);
      alexa.el.privacyAndCompliance.purchaseRadioButtons.eq(1).should('have.attr', checked);
      alexa.el.privacyAndCompliance.personalRadioButtons.eq(0).should('not.have.attr', checked);
      alexa.el.privacyAndCompliance.personalRadioButtons.eq(1).should('have.attr', checked);
      alexa.el.privacyAndCompliance.adsRadioButtons.eq(0).should('not.have.attr', checked);
      alexa.el.privacyAndCompliance.adsRadioButtons.eq(1).should('have.attr', checked);

      alexa.el.privacyAndCompliance.purchaseRadioButtons.eq(0).click();
      alexa.el.privacyAndCompliance.personalRadioButtons.eq(0).click();
      alexa.el.privacyAndCompliance.adsRadioButtons.eq(0).click();

      alexa.el.privacyAndCompliance.purchaseRadioButtons.eq(0).parent().find('span').should('have.class', 'vf-svg-icon--onRadioButton');
      alexa.el.privacyAndCompliance.purchaseRadioButtons.eq(1).parent().find('span').should('have.class', 'vf-svg-icon--offRadioButton');
      alexa.el.privacyAndCompliance.personalRadioButtons.eq(0).parent().find('span').should('have.class', 'vf-svg-icon--onRadioButton');
      alexa.el.privacyAndCompliance.personalRadioButtons.eq(1).parent().find('span').should('have.class', 'vf-svg-icon--offRadioButton');
      alexa.el.privacyAndCompliance.adsRadioButtons.eq(0).parent().find('span').should('have.class', 'vf-svg-icon--onRadioButton');
      alexa.el.privacyAndCompliance.adsRadioButtons.eq(1).parent().find('span').should('have.class', 'vf-svg-icon--offRadioButton');

      const testingInstructs = 'Ash nazg durbatulûk, ash nazg gimbatul, ash nazg thrakatulûk agh burzum-ishi krimpatul.';
      alexa.el.privacyAndCompliance.testingInstructions.type(testingInstructs).blur().should('have.value', testingInstructs);

      // alexa.el.submitButton.click();
    });
  });

  describe('Google launch page', () => {});
});
