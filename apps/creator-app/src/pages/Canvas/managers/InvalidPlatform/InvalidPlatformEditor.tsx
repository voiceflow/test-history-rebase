import React from 'react';

import { InfoSection } from '@/components/Section';
import { useActiveProjectPlatform } from '@/hooks';
import { Content } from '@/pages/Canvas/components/Editor';

import { getPlatformLabel } from './constants';

const InvalidPlatformEditor: React.FC = () => {
  const platform = useActiveProjectPlatform();

  return (
    <Content>
      <InfoSection>
        This block is not supported by the {getPlatformLabel(platform)} channel. This agent will still work, but we
        recommend you remove this block from your canvas.
      </InfoSection>
    </Content>
  );
};

export default InvalidPlatformEditor;
