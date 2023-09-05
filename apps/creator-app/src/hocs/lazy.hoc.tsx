import { Crypto } from '@voiceflow/common';
import { FullSpinner } from '@voiceflow/ui';
import React from 'react';

const getForceRefreshKey = (hash: string) => `component-has-force-refreshed:${hash}`;

interface ILazy<T extends React.ComponentType<any>> {
  name?: string;
  factory: () => Promise<{ default: T }>;
}

export const lazy = <T extends React.ComponentType<any>>({ name, factory }: ILazy<T>) => {
  const Component = React.lazy(async () => {
    const factoryHash = Crypto.MurmurHash.hash(factory.toString());
    const forceRefreshKey = getForceRefreshKey(factoryHash);

    try {
      const component = await factory();

      sessionStorage.removeItem(forceRefreshKey);

      return component;
    } catch (error) {
      if (import.meta.env.DEV || sessionStorage.getItem(forceRefreshKey)) {
        // The page has already been reloaded
        // Assuming that user is already using the latest version of the application.
        // Let's let the application crash and raise the error.
        throw error;
      }

      sessionStorage.setItem(forceRefreshKey, '1');
      window.location.reload();

      return { default: FullSpinner as React.ComponentType<any> };
    }
  });

  Object.assign(Component, { name: `withLazy(${name})` });

  return Component;
};
