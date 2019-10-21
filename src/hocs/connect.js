import * as ReactRedux from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { IS_PRODUCTION } from '@/config';

// eslint-disable-next-line import/prefer-default-export
export const connect = (mapStateToProps, mapDispatchToProps, mergeProps, options = {}) => {
  const isDebug = !IS_PRODUCTION && options.debug;
  const removeDispatch = options.removeDispatch;

  return ReactRedux.connect(
    (typeof mapStateToProps === 'function' ? mapStateToProps : mapStateToProps && createStructuredSelector(mapStateToProps)) || null,
    mapDispatchToProps || null,

    (mergeProps || isDebug || removeDispatch) &&
      ((stateProps, { dispatch, ...dispatchProps }, props) =>
        // eslint-disable-next-line no-console
        (isDebug && console.log('connect() was called', { stateProps, dispatchProps, props })) || {
          ...stateProps,
          ...dispatchProps,
          ...(removeDispatch || { dispatch }),
          ...props,
          ...(mergeProps && mergeProps(stateProps, dispatchProps, props)),
        }),
    options
  );
};
