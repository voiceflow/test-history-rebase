import { Box, IconButton, OptionsMenuOption, SectionV2, UIOnlyMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import { useEditor } from '../hooks';
import Header, { HeaderProps } from './Header';
import HeaderActionsButton from './HeaderActionsButton';

interface DefaultHeaderProps extends Partial<HeaderProps> {
  onBack?: VoidFunction;
  actions?: Array<OptionsMenuOption | UIOnlyMenuItemOption>;
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
        <HeaderActionsButton actions={actions} />
      </SectionV2.ActionsContainer>
    </Header>
  );
};

export default DefaultHeader;
