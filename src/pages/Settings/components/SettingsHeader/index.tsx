import React from 'react';

import { FlexCenter } from '@/components/Flex';

import HeaderText from './components';

const SettingsHeader: React.FC = () => {
  return (
    <HeaderText>
      <FlexCenter style={{ width: '100%' }}>Project Settings</FlexCenter>
    </HeaderText>
  );
};

export default SettingsHeader;
