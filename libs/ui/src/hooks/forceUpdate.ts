import React from 'react';

export const useForceUpdate = (): [() => void, number] => {
  const [key, forceUpdate] = React.useState<number>(0);

  return [React.useCallback(() => forceUpdate((prevKey) => prevKey + 1), []), key];
};
