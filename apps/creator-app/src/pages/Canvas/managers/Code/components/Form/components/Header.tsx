import type * as Realtime from '@voiceflow/realtime-sdk';
import { System } from '@voiceflow/ui';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';
import type { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

interface HeaderProps extends React.PropsWithChildren {
  editor: NodeEditorV2Props<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts>;
}

const Header: React.FC<HeaderProps> = ({ editor, children }) => (
  <EditorV2.Header>
    {children}

    <EditorV2.HeaderTitle>{editor.label}</EditorV2.HeaderTitle>

    <System.IconButtonsGroup.Base>
      <System.IconButton.Base
        icon={editor.isFullscreen ? 'systemMinimize' : 'systemExpand'}
        onClick={editor.onToggleFullscreen}
      />
    </System.IconButtonsGroup.Base>
  </EditorV2.Header>
);

export default Header;
