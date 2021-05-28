import capitalize from 'lodash/capitalize';

import { ClassName, Identifier } from '../../../src/styles/constants';

const GRID_BLOCK_PIXEL_UNIT = 300;

const canvasUtils = {
  waitForSave: () => {
    cy.intercept('/v2/diagrams/*').as('diagramSave');
    cy.wait('@diagramSave');
  },
  focusCanvas: () => {
    cy.get(`#${Identifier.CANVAS}`).focus();
  },
  unStickCanvas: () => {
    cy.get(`#${Identifier.CANVAS}`).click({ waitForAnimations: true });
  },
  clickCanvas: () => {
    cy.get(`#${Identifier.CANVAS}`).click({ waitForAnimations: true });
  },
  focusHome: () => {
    cy.get(`#${Identifier.CANVAS_HOME_BUTTON}`).click({ force: true, waitForAnimations: true });
  },
  spawnNodeInGrid: (blockName: string, xUnits: number, yUnits: number) => {
    canvasUtils.focusHome();
    cy.dragCanvas(-xUnits * GRID_BLOCK_PIXEL_UNIT, -yUnits * GRID_BLOCK_PIXEL_UNIT);
    canvasUtils.unStickCanvas();
    cy.addBlockToCanvasViaSpotlight(blockName);
    canvasUtils.unStickCanvas();
    // Wait for any draw.render lag
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(50);
  },
  dragBlockInGrid: (blockName: string, xUnits: number, yUnits: number, xPixelOffset = 0, yPixelOffset = 0) => {
    cy.dragCanvas(-xUnits * GRID_BLOCK_PIXEL_UNIT, -yUnits * GRID_BLOCK_PIXEL_UNIT);
    canvasUtils.unStickCanvas();
    cy.addBlockToCanvasViaStepMenu(capitalize(blockName), [300 + xPixelOffset, 250 + yPixelOffset]);
    canvasUtils.unStickCanvas();
    cy.dragCanvas(xUnits * GRID_BLOCK_PIXEL_UNIT, yUnits * GRID_BLOCK_PIXEL_UNIT);
    canvasUtils.unStickCanvas();
  },
  getHomeBlock: () => cy.get(`.${ClassName.HOME_BLOCK}`),
  clickHomeBlockPort: () => canvasUtils.getHomeBlock().find(`.${ClassName.CANVAS_PORT}`).click({ force: true, waitForAnimations: true }),
  getLastBlock: () => cy.get(`.${ClassName.CANVAS_BLOCK}`).last(),
  clickLastBlock: () => canvasUtils.getLastBlock().click({ force: true, waitForAnimations: true }),
  getLastStep: () => canvasUtils.getLastBlock().find(`.${ClassName.CANVAS_STEP}`),
  getPreviousNthBlock: (n = 2) => cy.get(`.${ClassName.CANVAS_BLOCK}`).eq(-n),
  clickPreviousNthBlock: (n = 2) => canvasUtils.getPreviousNthBlock(n).click({ force: true, waitForAnimations: true }),
  clickPreviousNthBlockPort: (n = 2, portNumber = 0) =>
    canvasUtils.getPreviousNthBlock(n).find(`.${ClassName.CANVAS_PORT}`).eq(portNumber).click({ force: true, waitForAnimations: true }),
  getLastPlacedPort: () => canvasUtils.getLastStep().find(`.${ClassName.CANVAS_PORT}`).eq(-1),
  clickLastPlacedPort: (portNumber = 0) => canvasUtils.getLastPlacedPort().eq(portNumber).click({ force: true, waitForAnimations: true }),
  connectLastBlockWithRecent: (portNumber = 0) => {
    canvasUtils.clickPreviousNthBlockPort(2, portNumber);
    canvasUtils.clickLastBlock();
  },
  focusLastStep: () => {
    canvasUtils.getLastStep().click('top', { force: true, waitForAnimations: true });
  },
  editor: {
    getEditor: () => cy.get(`#${Identifier.BLOCK_EDITOR}`),
    uploadImage: () => {
      canvasUtils.editor.getEditor().find('input[type="file"]').attachFile({
        filePath: 'image.png',
      });
    },
    addLineItem: () => {
      canvasUtils.editor.getEditor().find(`.${ClassName.EDITOR_FOOTER_BUTTON}`).last().click();
    },
    speak: {
      addText: (text: string) => {
        canvasUtils.editor.getEditor().find('.DraftEditor-root').click().type(text);
        canvasUtils.focusCanvas();
      },
    },
    visual: {},
    choice: {
      addIntent: (intentName: string) => {
        canvasUtils.editor.getEditor().find(`.${ClassName.INTENT_SELECT_INPUT}`).last().click().type(`${intentName}{enter}`);
      },
    },
  },
};

export default canvasUtils;
