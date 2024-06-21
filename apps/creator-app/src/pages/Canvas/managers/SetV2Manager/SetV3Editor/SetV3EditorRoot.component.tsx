import * as Realtime from '@voiceflow/realtime-sdk';
import { Editor } from '@voiceflow/ui-next';
import React from 'react';

import { useEditor } from '@/pages/Canvas/components/EditorV3/EditorV3.hook';
import { EditorV3HeaderActions } from '@/pages/Canvas/components/EditorV3/EditorV3HeaderActions.component';

import { SetV3EditorForm } from './SetV3EditorForm.component';

export const SetV3EditorRoot: React.FC = () => {
  const editor = useEditor<Realtime.NodeData.SetV2>();

  return (
    <Editor title="Set variables" readOnly headerActions={<EditorV3HeaderActions />}>
      <SetV3EditorForm editor={editor} />
    </Editor>
  );
};
