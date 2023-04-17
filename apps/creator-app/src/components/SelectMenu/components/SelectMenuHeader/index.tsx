import { ClickableText } from '@voiceflow/ui';
import React from 'react';

import { Header, Title } from './components';

interface HeaderProps {
  title?: string;
  clearable?: boolean;
  onClear: () => void;
  actionDisabled?: boolean;
}

const SelectMenuHeader: React.FC<HeaderProps> = ({ title = '', actionDisabled, clearable = true, onClear }) => (
  <Header>
    <Title>{title}</Title>
    {clearable && (
      <ClickableText disabled={actionDisabled} onClick={onClear}>
        Clear
      </ClickableText>
    )}
  </Header>
);

export default SelectMenuHeader;
