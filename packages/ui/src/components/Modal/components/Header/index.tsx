import Box from '@ui/components/Box';
import IconButton, { IconButtonBasicContainerProps } from '@ui/components/IconButton';
import TutorialInfoIcon from '@ui/components/TutorialInfoIcon';
import { ClassName } from '@ui/styles/constants';
import React from 'react';

import * as S from './styles';

export interface HeaderProps {
  border?: boolean;
  actions?: React.ReactNode;
  intoTooltip?: React.ReactNode;
  capitalizeText?: boolean;
}

const CloseButton: React.FC<Omit<IconButtonBasicContainerProps, 'size' | 'icon' | 'variant' | 'className'>> = (props) => (
  <IconButton size={16} icon="close" variant={IconButton.Variant.BASIC} className={ClassName.MODAL_CLOSE_BUTTON_REGULAR} {...props} />
);

const Header: React.FC<HeaderProps> = ({ border, actions, children, intoTooltip, capitalizeText = true }) => (
  <S.Container border={border} capitalizeText={capitalizeText}>
    <Box.Flex gap={8} height="100%">
      <Box.Flex height="100%" className={ClassName.MODAL_TITLE_CONTAINER}>
        {children}
      </Box.Flex>

      {intoTooltip && <TutorialInfoIcon>{intoTooltip}</TutorialInfoIcon>}
    </Box.Flex>

    {!!actions && (
      <Box.Flex gap={16} height="100%">
        {actions}
      </Box.Flex>
    )}
  </S.Container>
);

export default Object.assign(Header, {
  CloseButton,
});
