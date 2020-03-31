import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useForceUpdate = (): [() => void, number | null] => {
  const [key, forceUpdate] = React.useState<number | null>(null);

  return [React.useCallback(() => forceUpdate(Math.random()), []), key];
};
