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
  },
  transition(...propertyWhitelist) {
    const properties = propertyWhitelist.length ? propertyWhitelist : ['all'];

    return `transition: ${properties.map((property) => `${property} ${ANIMATION_SPEED}s ease`).join(',')};`;
  },
};

export default THEME;
