import { Animations } from '@voiceflow/ui';
import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';

import StickyContainer from '@/components/StickyContainer';

import Card from '../Card';
import * as S from './styles';

export interface Tab {
  path: string;
  tabs?: Tab[];
  label: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const { url } = useRouteMatch();

  return (
    <StickyContainer top={144} width={200}>
      <Animations.FadeLeft>
        <Card>
          {tabs.map((tab, index) => (
            <S.Tab key={index} as={NavLink} to={`${url}/${tab.path}`} activeClassName="active">
              {tab.label}
            </S.Tab>
          ))}
        </Card>
      </Animations.FadeLeft>
    </StickyContainer>
  );
};

export default Tabs;
