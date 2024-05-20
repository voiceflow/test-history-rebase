import * as Realtime from '@voiceflow/realtime-sdk';
import { Editor, Scroll, SquareButton } from '@voiceflow/ui-next';
import React from 'react';

import { useEditor } from '@/pages/Canvas/components/EditorV3/EditorV3.hook';

import { TriggersSection } from '../../components/Triggers/TriggersSection/TriggersSection.component';
import { CommandsSection } from './CommandsSection/CommandsSection.component';

export const StartEditorRoot: React.FC = () => {
  const editor = useEditor<Realtime.NodeData.Start>();

  return (
    <Editor
      title={editor.data.label || 'Start'}
      onTitleChange={(label) => editor.onChange({ label })}
      headerActions={<SquareButton size="medium" iconName="More" disabled />}
    >
      <Scroll>
        <TriggersSection />
        <CommandsSection />
      </Scroll>
    </Editor>
  );
};
