import { Box, Toggle, ToggleSize } from '@voiceflow/ui';
import React from 'react';

import { SectionProps, UncontrolledSection } from '@/components/Section';
import THEME from '@/styles/theme';

interface SettingsSectionProps extends SectionProps {
  toggle: VoidFunction;
  value: boolean;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ value, toggle, children, ...props }) => (
  <UncontrolledSection
    customHeaderStyling={{ paddingBottom: '13px', paddingTop: '24px', lineHeight: 'normal' }}
    onClick={toggle}
    suffix={<Toggle size={ToggleSize.EXTRA_SMALL} checked={value} onChange={toggle} />}
    {...props}
  >
    <Box color={THEME.colors.secondary} fontSize="13px" mb={24} mt={0} lineHeight="normal">
      {children}
    </Box>
  </UncontrolledSection>
);

export default SettingsSection;
