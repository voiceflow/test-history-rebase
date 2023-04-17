import React from 'react';

import { ContainerProps } from './components';

export type { ContentProps, DescriptionProps, HeaderProps, TitleProps } from './components';

export interface Props extends ContainerProps {
  header?: React.ReactNode;
  children?: React.ReactNode;
}
