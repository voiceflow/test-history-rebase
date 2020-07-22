import BLOCK_THEME, { BLOCK_WIDTH } from './block';
import BLOCK_STEP_THEME from './blockStep';
import { ANIMATION_SPEED, COLOR_BLUE } from './constants';
import ICON_THEME from './icon';

export { ANIMATION_SPEED, BLOCK_WIDTH };

const THEME = {
  unit: 8,
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  backgrounds: {
    offWhite: '#f9f9f9',
    offWhiteBlue: '#FAFAFC',
  },
  colors: {
    primary: '#132144',
    secondary: '#62778c',
    tertiary: '#8da2b5',
    quaternary: '#949DB0',
    red: '#E91E63',
    green: '#279745',
    blue: COLOR_BLUE,
    darkBlue: '#4886da',
  },
  space: {
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 20,
  },
  fontSizes: {
    s: 13,
    m: 15,
  },
  components: {
    button: {
      height: 42,
    },
    input: {
      height: 42,
    },
    captionedIconButton: {
      height: 60,
    },
    menuItem: {
      height: 42,
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
    icon: ICON_THEME,
    audioPlayer: {
      height: 108,
    },
    leftSidebar: {
      width: 250,
      hiddenWidth: 16,
      get contentWidth() {
        return this.width - this.hiddenWidth;
      },
    },
  },
  transition(...propertyWhitelist: string[]): string {
    const properties = propertyWhitelist.length ? propertyWhitelist : ['all'];

    return `transition: ${properties.map((property) => `${property} ${ANIMATION_SPEED}s ease`).join(',')};`;
  },
};

export type Theme = typeof THEME;

export default THEME;
