// eslint-disable-next-line import/prefer-default-export
export const setRef = (ref, value) => {
  if (ref) {
    if (typeof ref === 'function') {
      ref(value);
    } else {
      // eslint-disable-next-line no-param-reassign
      ref.current = value;
    }
  }
};
