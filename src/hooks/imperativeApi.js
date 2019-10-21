import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export function useImperativeApi({ ref, deps = [], creator = () => ({}), nodeWithApi }) {
  const nodeRef = React.useRef();

  React.useImperativeHandle(
    ref,
    () => ({
      api: {
        getBoundingClientRect: () => (nodeWithApi ? nodeRef.current.api.getBoundingClientRect() : nodeRef.current.getBoundingClientRect()),
        ...creator(nodeRef),
      },
    }),
    deps
  );

  return nodeRef;
}
