import React from 'react';

import { SectionVariants } from '@/components/Settings/constants';

import SectionBox from '../SectionBox';
import * as S from './styles';

interface SettingsSectionProps {
  title?: React.ReactNode;
  variant?: SectionVariants;
  children?: React.ReactNode;
  description?: React.ReactNode;
  marginBottom?: number;
  noContentPadding?: boolean;
}

const SettingsSection = React.forwardRef<HTMLDivElement, SettingsSectionProps>(
  ({ title, variant, noContentPadding = false, marginBottom, description, children }, ref) => (
    <S.SettingsSectionContainer ref={ref} marginBottom={marginBottom}>
      {title && <S.SectionTitle withDescription={!!description}>{title}</S.SectionTitle>}

      {description && <S.SectionDescription>{description}</S.SectionDescription>}

      <SectionBox variant={variant} noContentPadding={noContentPadding}>
        {children}
      </SectionBox>
    </S.SettingsSectionContainer>
  )
);

export default SettingsSection;
