import { FlexCenter, Text } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

const SelectCheckbox: React.FC<React.HTMLProps<any>> = ({ onClick }) => (
  <S.MinusButton onClick={onClick}>
    <S.MinusButtonIcon />
  </S.MinusButton>
);

const TextBox: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Text color="#F2F7F7" fontSize={13} opacity="50%">
    {children}
  </Text>
);

export default Object.assign(S.TableNavbarContainer, {
  SelectCheckbox,
  Actions: S.RightActions,
  SecondaryButton: S.SecondaryFooterButton,
  PrimaryButton: S.ToolbarPrimaryButton,
  Icon: S.IconFooterButton,
  TextBox,
  LeftActions: FlexCenter,
});
