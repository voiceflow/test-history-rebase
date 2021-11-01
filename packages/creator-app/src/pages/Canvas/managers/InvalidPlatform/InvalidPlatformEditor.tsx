import React from 'react';

import { InfoSection } from '@/components/Section';
import { Content } from '@/pages/Canvas/components/Editor';
import { PlatformContext } from '@/pages/Project/contexts';

import { getPlatformLabel } from './constants';

const InvalidPlatformEditor: React.FC = () => {
  const platform = React.useContext(PlatformContext)!;

  return (
    <Content>
      <InfoSection>
        This block is not supported by the {getPlatformLabel(platform)} channel. This project will still work, but we recommend you remove this block
        from your canvas.
      </InfoSection>
    </Content>
  );
};

export default InvalidPlatformEditor;
