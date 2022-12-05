import React from 'react';

import { SectionVariants } from '@/components/Settings/constants';

import SectionBox from '../SectionBox';
import * as S from './styles';

const SettingsSection: React.FC<{ title?: string; variant?: SectionVariants; noContentPadding?: boolean; marginBottom?: number }> = ({
  title,
  variant,
  noContentPadding = false,
  marginBottom,
  children,
}) => (
  <S.SettingsSectionContainer marginBottom={marginBottom}>
    {title && <S.SectionTitle>{title}</S.SectionTitle>}
    <SectionBox variant={variant} noContentPadding={noContentPadding}>
      {children}
    </SectionBox>
  </S.SettingsSectionContainer>
);

export default SettingsSection;
