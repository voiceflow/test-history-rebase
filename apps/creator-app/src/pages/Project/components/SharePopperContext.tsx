import type { Nullable } from '@voiceflow/common';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import type { ShareProjectTab } from '../constants';

interface SharePopperData {
  defaultTab?: ShareProjectTab;
}

interface SharePopperValue {
  open: (defaultTab?: ShareProjectTab) => void;
  close: () => void;

  data: Nullable<SharePopperData>;
  opened: boolean;
}

export const SharePopperContext = React.createContext<Nullable<SharePopperValue>>(null);

export const { Consumer: SharePopperConsumer } = SharePopperContext;

export const SharePopperProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [data, setData] = React.useState<Nullable<SharePopperData>>(null);
  const [opened, setOpened] = React.useState(false);

  const open = React.useCallback((defaultTab?: ShareProjectTab) => {
    setData({ defaultTab });
    setOpened(true);
  }, []);

  const close = React.useCallback(() => {
    setOpened(false);
    setData(null);
  }, []);

  const api = useContextApi({
    data,
    open,
    close,
    opened,
  });

  return <SharePopperContext.Provider value={api}>{children}</SharePopperContext.Provider>;
};
