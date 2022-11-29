import React from 'react';

import { DescriptorContainer, DescriptorVariant } from '@/pages/Settings/components/ContentDescriptors/components';

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

export default { RepeatDialog, RepeatEverything };
