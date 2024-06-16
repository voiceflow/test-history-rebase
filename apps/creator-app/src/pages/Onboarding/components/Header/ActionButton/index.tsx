import { SvgIcon, SvgIconTypes } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

interface ActionButtonProps {
  icon: SvgIconTypes.Icon;
  label: string;
  onClick: () => void;
  className?: string;
  shouldRender: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ className, shouldRender, icon, label, onClick }) => (
  <S.Container className={className}>
    {shouldRender && (
      <S.InnerContainer onClick={onClick}>
        <S.IconContainer>
          <SvgIcon icon={icon} color="#becedc" />
        </S.IconContainer>

        <S.Label>{label}</S.Label>
      </S.InnerContainer>
    )}
  </S.Container>
);

export default ActionButton;
