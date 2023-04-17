import React from 'react';

export type { IconButtonTypes as IconButton } from './components';

export interface Props extends React.PropsWithChildren {
  renderLogoButton?: () => React.ReactNode;
  containerStyles?: React.CSSProperties;
}
