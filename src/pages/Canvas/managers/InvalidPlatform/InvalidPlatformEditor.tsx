import React from 'react';
import { useSelector } from 'react-redux';

import { InfoSection } from '@/components/Section';
import * as Skill from '@/ducks/skill';
import { Content } from '@/pages/Canvas/components/Editor';

import { getPlatformLabel } from './constants';

const InvalidPlatformEditor: React.FC = () => {
  const platform = useSelector(Skill.activePlatformSelector);

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
