import React from 'react';

import Box from '@/components/Box';
import TutorialInfoIcon from '@/components/TutorialInfoIcon';
import { ClassName } from '@/styles/constants';
import * as System from '@/system';

import * as S from './styles';

export interface HeaderProps extends React.HTMLProps<any> {
  border?: boolean;
  sticky?: boolean;
  actions?: React.ReactNode;
  infoTooltip?: React.ReactNode;
  capitalizeText?: boolean;
}

const CloseButton: React.FC<Omit<System.IconButton.I.Props, 'icon' | 'className'>> = (props) => (
  <System.IconButton.Base icon="close" className={ClassName.MODAL_CLOSE_BUTTON_REGULAR} {...props} />
);

const CloseButtonAction: React.FC<Omit<System.IconButton.I.Props, 'icon' | 'className'>> = (props) => (
  <System.IconButtonsGroup.Base>
    <CloseButton {...props} />
  </System.IconButtonsGroup.Base>
);

const Header: React.FC<HeaderProps> = ({
  border,
  actions,
  children,
  infoTooltip,
  capitalizeText = true,
  sticky = true,
  style,
}) => (
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
  CloseButtonAction,
});
