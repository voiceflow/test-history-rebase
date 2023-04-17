import React from 'react';

export type { HeaderTypes as Header } from './components';

export interface ContentProps extends React.PropsWithChildren {
  scrollable: boolean;
  white?: boolean;
}

export interface Props extends Partial<ContentProps> {
  className?: string;
  renderHeader?: () => React.ReactNode;
  renderSidebar?: () => React.ReactNode;
}
