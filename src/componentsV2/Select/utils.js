import _isFunction from 'lodash/isFunction';

// eslint-disable-next-line import/prefer-default-export
export const setRef = (ref, node) => {
  if (ref) {
    if (_isFunction(ref)) {
      ref(node);
    } else {
      ref.current = node;
    }
  }
};
