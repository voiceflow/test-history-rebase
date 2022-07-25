import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { InfoSection } from '@/components/Section';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { HelpTooltip } from './components';

const ExitEditor: NodeEditor<Realtime.NodeData.Exit> = ({ data }) => (
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
    <InfoSection>End block ends the project in its current state.</InfoSection>
  </Content>
);

export default ExitEditor;
