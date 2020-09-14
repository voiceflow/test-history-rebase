import React from 'react';

import { DescriptorContainer, DescriptorVariant } from '@/pages/SettingsV2/components/ContentDescriptors/components';

const ProjectName: React.FC = () => {
  return <DescriptorContainer>Your project name is the name of the project that you will see on your workspace dashboard.</DescriptorContainer>;
};

const RepeatDialog = (
  <DescriptorContainer variant={DescriptorVariant.SUFFIX}>
    This option will repeat the last speak step before the user said “repeat”.
  </DescriptorContainer>
);

const RepeatEverything = (
  <DescriptorContainer variant={DescriptorVariant.SUFFIX}>
    This option will repeat all steps after the users previous interacted with your project.
  </DescriptorContainer>
);

export default { ProjectName, RepeatDialog, RepeatEverything };
