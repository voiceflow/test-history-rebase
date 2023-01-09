import React from 'react';

import * as S from './styles';

interface ActionSubSectionProps {
  title: React.ReactNode;
  action: React.ReactNode;
  description: React.ReactNode;
}

const ActionSubSection: React.FC<ActionSubSectionProps> = ({ title, action, description }) => (
  <S.Container>
    <S.LeftSection>
      <S.Title>{title}</S.Title>

      <S.Description>{description}</S.Description>
    </S.LeftSection>

    <S.RightSection>{action}</S.RightSection>
  </S.Container>
);

export default ActionSubSection;
