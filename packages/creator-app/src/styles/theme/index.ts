import { createTheme } from '@voiceflow/ui';

import BLOCK_THEME, { BLOCK_WIDTH } from './block';
import BLOCK_STEP_THEME from './blockStep';
import { ANIMATION_SPEED } from './constants';

export { ANIMATION_SPEED, BLOCK_WIDTH };

const THEME = createTheme({
  components: {
    captionedIconButton: {
      height: 60,
    },
    blockSidebar: {
      width: 480,
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
    modals: {
      plan: {
        width: 545,
      },
      collaborators: {
        width: 545,
      },
      planRestriction: {
        width: 392,
      },
    },
    block: BLOCK_THEME,
    blockStep: BLOCK_STEP_THEME,
    audioPlayer: {
      height: 108,
    },
    imageUpload: {
      height: 230,
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
    },
    subHeader: {
      height: 50,
    },
    subMenu: {
      width: 65,
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
    get usedPrototypeDisplayCanvasWidth() {
      return this.displaySettings.width + this.usedGeneralPrototypeDisplayCanvasWidth;
    },
    get usedGeneralPrototypeDisplayCanvasWidth() {
      return this.subMenu.width + this.prototypeSidebar.width;
    },
    get usedPrototypeDisplayCanvasHeight() {
      return this.header.height;
    },
  },
  transition(...propertyWhitelist: string[]): string {
    const properties = propertyWhitelist.length ? propertyWhitelist : ['all'];

    return `transition: ${properties.map((property) => `${property} ${ANIMATION_SPEED}s ease`).join(',')};`;
  },
});

export type Theme = typeof THEME;

export default THEME;
