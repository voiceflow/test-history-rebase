import BLOCK_THEME from './block';

export const ANIMATION_SPEED = 0.15;

const THEME = {
  unit: 8,
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
    captionedIconButton: {
      height: 60,
    },
    menuItem: {
      height: 42,
    },
    editSidebar: {
      width: 400,
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
  },
  transition(...propertyWhitelist) {
    const properties = propertyWhitelist.length ? propertyWhitelist : ['all'];

    return `transition: ${properties.map((property) => `${property} ${ANIMATION_SPEED}s ease`).join(',')};`;
  },
};

export default THEME;
