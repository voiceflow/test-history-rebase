// eslint-disable-next-line import/prefer-default-export
export const buildVirtualElement = ([left, top]) => ({
  getBoundingClientRect() {
    return {
      top,
      left,
      bottom: top,
      right: left,
      width: 0,
      height: 0,
    };
  },

  // eslint-disable-next-line lodash/prefer-constant
  get clientWidth() {
    return 0;
  },

  // eslint-disable-next-line lodash/prefer-constant
  get clientHeight() {
    return 0;
  },
});
