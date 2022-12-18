import React from 'react';

import { SectionVariants } from '@/components/Settings/constants';

import SectionBox from '../SectionBox';
import * as S from './styles';

const SettingsSection: React.FC<{
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: SectionVariants;
  noContentPadding?: boolean;
  marginBottom?: number;
}> = ({ title, variant, noContentPadding = false, marginBottom, description, children }) => (
  <S.SettingsSectionContainer marginBottom={marginBottom}>
    {title && <S.SectionTitle withDescription={!!description}>{title}</S.SectionTitle>}
    {description && <S.SectionDescription>{description}</S.SectionDescription>}
    <SectionBox variant={variant} noContentPadding={noContentPadding}>
      {children}
    </SectionBox>
  </S.SettingsSectionContainer>
);

export default SettingsSection;
