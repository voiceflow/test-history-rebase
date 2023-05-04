import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { IntentButtons, NoMatchV2, NoReplyV2 } from '../../components';
import HelpTooltip from './HelpTooltip';

const PromptEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Prompt, Realtime.NodeData.PromptBuiltInPorts>();
  const buttonsConfig = IntentButtons.useConfig();
  const noMatchConfig = NoMatchV2.useConfig({ step: editor.data });
  const noReplyConfig = NoReplyV2.useConfig({ step: editor.data });

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        <EditorV2.DefaultFooter tutorial={{ content: <HelpTooltip /> }}>
          <EditorV2.FooterActionsButton actions={[buttonsConfig.option, noMatchConfig.option, noReplyConfig.option]} />
        </EditorV2.DefaultFooter>
      }
    >
      <SectionV2.SimpleSection>
        <SectionV2.Title secondary>Prompts will stop & listen for the user to match an intent.</SectionV2.Title>
      </SectionV2.SimpleSection>

      {buttonsConfig.section}

      {noMatchConfig.section}

      {noReplyConfig.section}
    </EditorV2>
  );
};

export default PromptEditor;
