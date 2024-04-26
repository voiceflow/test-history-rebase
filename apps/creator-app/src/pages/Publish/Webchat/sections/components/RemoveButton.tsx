import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

export const RemoveButton: React.FC<{ top?: number; right?: number; onClick: () => Promise<void> }> = ({
  top,
  right,
  onClick,
}) => (
  <S.RemoveButton top={top} right={right} onClick={onClick}>
    <SvgIcon size={8} icon="close" color="#8da2b5" />
  </S.RemoveButton>
);

export default RemoveButton;
