import _isFunction from 'lodash/isFunction';

// eslint-disable-next-line import/prefer-default-export
export const setRef = (ref, value) => {
  if (ref) {
    if (_isFunction(ref)) {
      ref(value);
    } else {
      ref.current = value;
    }
  }
};
