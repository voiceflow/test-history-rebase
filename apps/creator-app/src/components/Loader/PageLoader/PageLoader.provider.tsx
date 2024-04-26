import { Box, PageLoader, Portal, useCreateConst } from '@voiceflow/ui-next';
import React, { memo, useContext, useEffect, useId, useMemo, useState } from 'react';

import { PageLoaderContext, PageLoaderProgressContext } from './PageLoader.context';
import type { IPageLoaderProvider } from './PageLoader.interface';

export const PageLoaderProvider: React.FC<IPageLoaderProvider> = memo(({ children }) => {
  const loaderID = useId();
  const parentLoaders = useContext(PageLoaderProgressContext);
  const [loaders, setLoaders] = useState<Record<string, boolean>>({ [loaderID]: false });
  const [loaderVisible, setLoaderVisible] = useState(true);

  const parentLoaded = useCreateConst(
    () => !parentLoaders || Object.values(parentLoaders).every((val) => val === true)
  );

  const combinedLoaders = useMemo(() => {
    if (parentLoaded) return loaders;

    return { ...parentLoaders, ...loaders };
  }, [loaders, parentLoaded, parentLoaders]);

  const progress = useMemo(() => {
    const values = Object.values(combinedLoaders);

    return Math.ceil((values.filter(Boolean).length / values.length) * 100);
  }, [combinedLoaders]);

  useEffect(() => {
    setLoaders((prevLoaders) => ({ ...prevLoaders, [loaderID]: true }));
  }, []);

  const loading = progress < 100;
  useEffect(() => {
    if (loading) return undefined;

    const timeout = setTimeout(() => setLoaderVisible(false), 350);

    return () => clearTimeout(timeout);
  }, [loading]);

  const api = useCreateConst(() => ({
    loaded: (id: string) => setLoaders((prevLoaders) => ({ ...prevLoaders, [id]: true })),
    register: (id: string) => {
      setLoaders((prevLoaders) => ({ ...prevLoaders, [id]: prevLoaders[id] ?? false }));

      return () => {
        setLoaders(({ [id]: _, ...prevLoaders }) => prevLoaders);
      };
    },
  }));

  return (
    <PageLoaderContext.Provider value={api}>
      <PageLoaderProgressContext.Provider value={combinedLoaders}>
        {loaderVisible && (
          <Portal>
            <Box style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
              <PageLoader progress={progress} />
            </Box>
          </Portal>
        )}

        {children}
      </PageLoaderProgressContext.Provider>
    </PageLoaderContext.Provider>
  );
});
