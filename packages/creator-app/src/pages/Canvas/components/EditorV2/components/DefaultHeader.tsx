import { Box, IconButton, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { useEditor } from '../hooks';
import ActionsButton, { Action } from './ActionsButton';
import Header, { HeaderProps } from './Header';

interface DefaultHeaderProps extends Partial<HeaderProps> {
  onBack?: VoidFunction;
  actions?: Action[];
}

const DefaultHeader: React.FC<DefaultHeaderProps> = ({ title, actions, onBack }) => {
  const editor = useEditor();

  return (
    <Header
      title={title ?? editor.label}
      prefix={
        onBack ? (
          <Box mr={22}>
            <IconButton icon="largeArrowLeft" onClick={() => onBack()} variant={IconButton.Variant.BASIC} />
          </Box>
        ) : null
      }
    >
      <SectionV2.ActionsContainer>
        <ActionsButton actions={actions} />
      </SectionV2.ActionsContainer>
    </Header>
  );
};

export default DefaultHeader;
