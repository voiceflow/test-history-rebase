import type React from 'react';

import type { ContainerProps } from './components';

export type { ContentProps, DescriptionProps, HeaderProps, TitleProps } from './components';

export interface Props extends ContainerProps {
  header?: React.ReactNode;
  children?: React.ReactNode;
}
