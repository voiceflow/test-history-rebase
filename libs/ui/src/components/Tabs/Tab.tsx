import React from 'react';

import * as S from './styles';

export type TabValue = number | string;

export interface TabsTabProps<V> {
  value: V;
  onClick?: VoidFunction;
  isActive?: boolean;
  children: React.ReactNode;
}

export interface TabReactElement<V> extends React.ReactElement<TabsTabProps<V>> {}

const TabsTab = <V extends TabValue>({ children, value, isActive, onClick }: TabsTabProps<V>): JSX.Element => (
  <S.Tab type="button" value={value} isActive={isActive} onClick={onClick}>
    <S.Label>{children}</S.Label>
  </S.Tab>
);

export default TabsTab;
