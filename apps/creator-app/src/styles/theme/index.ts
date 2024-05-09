import { createTheme } from '@voiceflow/ui';

import { BLOCK_WIDTH } from './block';
import BLOCK_STEP_THEME from './blockStep';
import { ANIMATION_SPEED } from './constants';
import PAGE from './page';

export { ANIMATION_SPEED, BLOCK_WIDTH };

const THEME = createTheme({
  components: {
    captionedIconButton: {
      height: 60,
    },
    blockSidebar: {
      width: 450,
    },
    markupSidebar: {
      width: 360,
    },
    historyDrawer: {
      width: 440,
    },
    menuBar: {
      width: 40,
    },
    menuHandle: {
      width: 18,
    },
    menuDrawer: {
      width: 250,
    },
    block: {
      width: BLOCK_WIDTH,
    },
    blockStep: BLOCK_STEP_THEME,
    audioPlayer: {
      height: 108,
    },
    imageUpload: {
      height: 230,
    },
    designMenu: {
      minWidth: 200,
      maxWidth: 450,
      width: 228,
      hiddenWidth: 16,
      get contentWidth() {
        return this.width - this.hiddenWidth;
      },
    },
    leftSidebar: {
      width: 250,
      hiddenWidth: 16,
      get contentWidth() {
        return this.width - this.hiddenWidth;
      },
    },
    header: {
      height: 64,
      newHeight: 56,
    },
    subHeader: {
      height: 50,
    },
    developerSettings: {
      width: 320,
    },
    displaySettings: {
      width: 234,
    },
    prototypeSidebar: {
      width: 400,
    },
    sidebarIconMenu: {
      width: 61,
      newWidth: 56,

      itemHeight: 60,
      smallItemHeight: 48,
    },
    testVariablesSidebar: {
      width: 275,
    },
    navSidebar: {
      width: 250,

      itemHeight: 32,
    },
    get usedPrototypeDisplayCanvasWidth() {
      return this.displaySettings.width + this.usedGeneralPrototypeDisplayCanvasWidth;
    },
    get usedGeneralPrototypeDisplayCanvasWidth() {
      return this.sidebarIconMenu.width + this.prototypeSidebar.width;
    },
    get usedPrototypeDisplayCanvasHeight() {
      return this.header.height;
    },
    page: PAGE,
  },
  transition(...propertyWhitelist: string[]): string {
    const properties = propertyWhitelist.length ? propertyWhitelist : ['all'];

    return `transition: ${properties.map((property) => `${property} ${ANIMATION_SPEED}s ease`).join(',')};`;
  },
});

export type Theme = typeof THEME;

export default THEME;
