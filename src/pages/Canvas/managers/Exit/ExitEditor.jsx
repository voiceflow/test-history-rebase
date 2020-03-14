import React from 'react';

import { Content, Controls } from '@/pages/Canvas/components/Editor';

import { HelpTooltip, Section } from './components';

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
      <Section>Exit block ends the project in its current state.</Section>
    </Content>
  );
};

export default ExitEditor;
