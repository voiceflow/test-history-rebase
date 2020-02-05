import BLOCK_THEME from './block';

export const ANIMATION_SPEED = 0.15;

const PRIMARY_COLOR = '#6E849A';
const SECONDARY_COLOR = '#787878';
const TERTIARY_COLOR = '#BECEDC';
const ACTIVE_COLOR = '#5D9DF5';
const WHITE = '#FFF';

const ICON_THEME = {
  standard: {
    color: PRIMARY_COLOR,
    hoverColor: PRIMARY_COLOR,
  },
  popover: {
    color: PRIMARY_COLOR,
    hoverColor: PRIMARY_COLOR,
    activeColor: ACTIVE_COLOR,
  },
  secondary: { color: SECONDARY_COLOR, hoverColor: SECONDARY_COLOR },
  tertiary: { color: TERTIARY_COLOR, hoverColor: TERTIARY_COLOR, activeColor: TERTIARY_COLOR },
  blue: { color: ACTIVE_COLOR },
  white: { color: WHITE },
};

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
    blue: '#5d9df5',
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
    step: {
      minHeight: 54,
      labelText: {
        variants: {
          primary: '#132144',
          secondary: '#62778c',
          placeholder: '#8da2b5',
        },
      },
      activeBorderColor: '#5d9df5',
    },
    icon: ICON_THEME,
    audioPlayer: {
      height: 108,
    },
  },
  transition(...propertyWhitelist) {
    const properties = propertyWhitelist.length ? propertyWhitelist : ['all'];

    return `transition: ${properties.map((property) => `${property} ${ANIMATION_SPEED}s ease`).join(',')};`;
  },
};

export default THEME;
