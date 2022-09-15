import canvasPage from '../../../../pages/canvas';
import canvasUtils from '../../buildTools';

const init = () => {
  cy.createProject('alexa');
  canvasPage.goToCanvas();
  canvasUtils.focusHome();
};

export const createSimpleSpeakChoice = () => {
  init();

  canvasUtils.spawnNodeInGrid('speak', 1, 0);
  canvasUtils.focusLastStep();
  canvasUtils.editor.speak.addText('Test');
  canvasUtils.clickHomeBlockPort();
  canvasUtils.clickLastBlock();
  canvasUtils.spawnNodeInGrid('choice', 2, 0);
  canvasUtils.connectLastBlockWithRecent();
  canvasUtils.focusLastStep();
  canvasUtils.editor.choice.addIntent('yes');
  canvasUtils.editor.addLineItem();
  canvasUtils.editor.choice.addIntent('no');
  canvasUtils.spawnNodeInGrid('speak', 3, 0);
  canvasUtils.focusLastStep();
  canvasUtils.editor.speak.addText('Yes End');
  canvasUtils.clickPreviousNthBlockPort(2, 0);
  canvasUtils.clickLastBlock();
  canvasUtils.spawnNodeInGrid('speak', 3, 1);
  canvasUtils.focusLastStep();
  canvasUtils.editor.speak.addText('No End');
  canvasUtils.clickPreviousNthBlockPort(3, 1);
  canvasUtils.clickLastBlock();
  canvasUtils.clickCanvas();
};

export const createSimple2BlockSpeak = () => {
  init();

  canvasUtils.spawnNodeInGrid('speak', 1, 0);
  canvasUtils.focusLastStep();
  canvasUtils.editor.speak.addText('Speak 1, welcome to a simple Alexa project');
  canvasUtils.clickHomeBlockPort();
  canvasUtils.clickLastBlock();
  canvasUtils.spawnNodeInGrid('speak', 2, 0);
  canvasUtils.focusLastStep();
  canvasUtils.editor.speak.addText('Bye, this is the end');
  canvasUtils.connectLastBlockWithRecent(0);
  canvasUtils.clickCanvas();
};

export const createSimpleDisplay = () => {
  cy.intercept('POST', '/image').as('updateImage');
  init();

  canvasUtils.spawnNodeInGrid('display', 1, 0);
  canvasUtils.clickHomeBlockPort();
  canvasUtils.clickLastBlock();
  canvasUtils.focusLastStep();
  canvasUtils.editor.uploadImage();
  cy.wait('@updateImage');
};
