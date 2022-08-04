import Box from '@ui/components/Box';
import IconButton from '@ui/components/IconButton';
import TutorialInfoIcon from '@ui/components/TutorialInfoIcon';
import { ClassName } from '@ui/styles/constants';
import { Nullable } from '@voiceflow/common';
import React from 'react';

import * as S from './styles';

export interface HeaderProps {
  border?: boolean;
  actions?: React.ReactNode;
  onClose?: Nullable<React.MouseEventHandler<HTMLButtonElement>>;
  intoTooltip?: React.ReactNode;
  capitalizeText?: boolean;
}

const Header: React.FC<HeaderProps> = ({ border, actions, onClose, children, intoTooltip, capitalizeText = true }) => (
  <S.Container border={border} capitalizeText={capitalizeText}>
    <Box.Flex gap={8} height="100%">
      <Box.Flex height="100%" className={ClassName.MODAL_TITLE_CONTAINER}>
        {children}
      </Box.Flex>

      {intoTooltip && <TutorialInfoIcon>{intoTooltip}</TutorialInfoIcon>}
    </Box.Flex>

    <Box.Flex gap={16} height="100%">
      {actions && <Box.Flex>{actions}</Box.Flex>}

      {onClose && (
        <IconButton size={16} icon="close" variant={IconButton.Variant.BASIC} onClick={onClose} className={ClassName.MODAL_CLOSE_BUTTON_REGULAR} />
      )}
    </Box.Flex>
  </S.Container>
);

export default Header;
