import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import HelpTooltip from './HelpTooltip';

const Editor: NodeEditorV2<Realtime.NodeData.Exit> = () => (
  <EditorV2 header={<EditorV2.DefaultHeader />} footer={<EditorV2.DefaultFooter tutorial={{ content: <HelpTooltip /> }} />}>
    <SectionV2.SimpleSection>End block ends the agent in its current state.</SectionV2.SimpleSection>
  </EditorV2>
);

export default Editor;
