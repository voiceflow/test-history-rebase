import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useForceUpdate = () => {
  const [key, forceUpdate] = React.useState(null);

  return [React.useCallback(() => forceUpdate(Math.random()), []), key];
};
