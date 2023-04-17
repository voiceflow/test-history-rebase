import React from 'react';

export const forwardRef = <T, P>(name: string, render: React.ForwardRefRenderFunction<T, P>) => {
  const Component = React.forwardRef<T, P>(render);

  Component.displayName = name;

  return Component;
};
