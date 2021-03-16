import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';

import StickyContainer from '@/components/StickyContainer';
import { FadeLeftContainer } from '@/styles/animations';

import SectionBox from '../SectionBox';
import { SettingsTab } from './components';

export type Tab = { label: React.ReactNode; path: string; tabs?: Tab[] };

type SettingsTabsProps = {
  tabs: Tab[];
};
const SettingsTabs: React.FC<SettingsTabsProps> = ({ tabs }) => {
  const { url } = useRouteMatch();

  return (
    <StickyContainer top={144} width={200}>
      <FadeLeftContainer>
        <SectionBox>
          {tabs.map((tab, index) => (
            <SettingsTab key={index} as={NavLink} to={`${url}/${tab.path}`} activeClassName="active">
              {tab.label}
            </SettingsTab>
          ))}
        </SectionBox>
      </FadeLeftContainer>
    </StickyContainer>
  );
};

export default SettingsTabs;
