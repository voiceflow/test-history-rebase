import { Box, Toggle } from '@voiceflow/ui';
import React from 'react';

import type { SectionProps } from '@/components/Section';
import { UncontrolledSection } from '@/components/Section';
import THEME from '@/styles/theme';

interface SettingsSectionProps extends SectionProps {
  toggle: VoidFunction;
  value: boolean;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ value, toggle, children, ...props }) => (
  <UncontrolledSection
    customHeaderStyling={{ padding: '24px 32px 8px', lineHeight: 'normal' }}
    onClick={toggle}
    suffix={<Toggle size={Toggle.Size.EXTRA_SMALL} checked={value} onChange={toggle} />}
    {...props}
  >
    <Box color={THEME.colors.secondary} fontSize="13px" mb={24} mt={0} lineHeight="normal">
      {children}
    </Box>
  </UncontrolledSection>
);

export default SettingsSection;
