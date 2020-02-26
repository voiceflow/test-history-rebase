import BLOCK_THEME from './block';
import BLOCK_STEP_THEME from './blockStep';
import { ANIMATION_SPEED, COLOR_BLUE } from './constants';
import ICON_THEME from './icon';

export { ANIMATION_SPEED };

const THEME = {
  unit: 8,
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  color: {
    background: '#f9f9f9',
    gradient: [
      // brightest
      '#fff', // '0'
      // darkest
    ],
    offWhite: '#FAFAFC',
    blue: COLOR_BLUE,
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
    editSidebar: {
      width: 480,
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
    },
    block: BLOCK_THEME,
    blockStep: BLOCK_STEP_THEME,
    icon: ICON_THEME,
    audioPlayer: {
      height: 108,
    },
  },
  transition(...propertyWhitelist: string[]): string {
    const properties = propertyWhitelist.length ? propertyWhitelist : ['all'];

    return `transition: ${properties.map((property) => `${property} ${ANIMATION_SPEED}s ease`).join(',')};`;
  },
};

export type Theme = typeof THEME;

export default THEME;
