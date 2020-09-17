import React from 'react';

import { DescriptorContainer, DescriptorVariant } from '@/pages/Settings/components/ContentDescriptors/components';

const ContinuePrevious: React.FC = () => {
  return (
    <DescriptorContainer variant={DescriptorVariant.PREFIX}>
      When toggled on, your project will remember where a user left off at in their previous session. You’ll then be able to ask them if they wish to
      continue from that point.
    </DescriptorContainer>
  );
};

const AllowRepeat: React.FC = () => {
  return (
    <DescriptorContainer variant={DescriptorVariant.PREFIX}>
      When toggled on, users will be able to say ‘repeat’ at any point in the conversation to replay the previous speak step, or all the content from
      the last interaction.
    </DescriptorContainer>
  );
};

export default { ContinuePrevious, AllowRepeat };
