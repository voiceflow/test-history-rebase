import Box from '@ui/components/Box';
import IconButton, { IconButtonBasicContainerProps } from '@ui/components/IconButton';
import TutorialInfoIcon from '@ui/components/TutorialInfoIcon';
import { ClassName } from '@ui/styles/constants';
import React from 'react';

import * as S from './styles';

export interface HeaderProps extends React.HTMLProps<any> {
  border?: boolean;
  sticky?: boolean;
  actions?: React.ReactNode;
  infoTooltip?: React.ReactNode;
  capitalizeText?: boolean;
}

const CloseButton: React.OldFC<Omit<IconButtonBasicContainerProps, 'size' | 'icon' | 'variant' | 'className'>> = (props) => (
  <IconButton size={16} icon="close" variant={IconButton.Variant.BASIC} className={ClassName.MODAL_CLOSE_BUTTON_REGULAR} {...props} />
);

const Header: React.OldFC<HeaderProps> = ({ border, actions, children, infoTooltip, capitalizeText = true, sticky = true, style }) => (
  <S.Container border={border} capitalizeText={capitalizeText} sticky={sticky} style={style}>
    <Box.Flex gap={8} height="100%">
      <Box.Flex height="100%" className={ClassName.MODAL_TITLE_CONTAINER}>
        {children}
      </Box.Flex>

      {infoTooltip && <TutorialInfoIcon>{infoTooltip}</TutorialInfoIcon>}
    </Box.Flex>

    {!!actions && (
      <Box.Flex gap={16} height="100%">
        {actions}
      </Box.Flex>
    )}
  </S.Container>
);

export default Object.assign(Header, {
  Title: S.Title,
  CloseButton,
});
