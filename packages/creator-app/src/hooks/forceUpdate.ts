import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useForceUpdate = (): [() => void, number] => {
  const [key, forceUpdate] = React.useState<number>(0);

  return [React.useCallback(() => forceUpdate((prevKey) => prevKey + 1), []), key];
};
