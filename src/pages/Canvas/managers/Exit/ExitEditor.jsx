import React from 'react';

import { InfoSection } from '@/components/Section';
import { Content, Controls } from '@/pages/Canvas/components/Editor';

import { HelpTooltip } from './components';

export const ExitEditor = ({ data }) => {
  return (
    <Content
      footer={() => (
        <Controls
          anchor="Learn more"
          tutorial={{
            content: <HelpTooltip />,
            blockType: data.type,
            helpTitle: null,
            helpMessage: null,
          }}
        />
      )}
    >
      <InfoSection>Exit block ends the project in its current state.</InfoSection>
    </Content>
  );
};

export default ExitEditor;
