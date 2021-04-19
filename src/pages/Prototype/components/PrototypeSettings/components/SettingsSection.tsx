import React from 'react';

import Box from '@/components/Box';
import { SectionProps, UncontrolledSection } from '@/components/Section';
import Toggle from '@/components/Toggle';

const SettingsSection: React.FC<{ toggle: () => void; value: boolean } & SectionProps> = ({ value, toggle, children, ...props }) => (
  <UncontrolledSection onClick={toggle} suffix={<Toggle small checked={value} onChange={toggle} />} {...props}>
    <Box color="#62778c" mb={20} mt={-6}>
      {children}
    </Box>
  </UncontrolledSection>
);

export default SettingsSection;
