import { Editor, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import { EditorV3HeaderActions } from '@/pages/Canvas/components/EditorV3/EditorV3HeaderActions.component';

export const ButtonsV2EditorRoot: React.FC = () => {
  return (
    <Editor title="Buttons" readOnly headerActions={<EditorV3HeaderActions />}>
      <Scroll>Placeholder</Scroll>
    </Editor>
  );
};
