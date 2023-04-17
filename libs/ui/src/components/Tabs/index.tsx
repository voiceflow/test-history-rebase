import React from 'react';

import * as S from './styles';
import Tab, { TabReactElement, TabValue } from './Tab';

export interface TabsProps<V extends TabValue> {
  value?: V;
  children: TabReactElement<V>[];
  onChange?: (value: V) => void;
}

const Tabs = <V extends TabValue>({ children, value, onChange }: TabsProps<V>): JSX.Element => (
  <S.Container>
    {React.Children.map(children, (tab) => (
      <React.Fragment key={tab.key || tab.props.value}>
        {React.cloneElement(tab, {
          onClick: () => {
            onChange?.(tab.props.value);
          },
          isActive: tab.props.value === value,
        })}
      </React.Fragment>
    ))}
  </S.Container>
);

export default Object.assign(Tabs, { Tab });
