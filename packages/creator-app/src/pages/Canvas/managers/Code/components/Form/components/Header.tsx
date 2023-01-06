import * as Realtime from '@voiceflow/realtime-sdk';
import { IconButton, IconButtonVariant } from '@voiceflow/ui';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

interface HeaderProps {
  editor: NodeEditorV2Props<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts>;
}

const Header: React.OldFC<HeaderProps> = ({ editor, children }) => (
  <EditorV2.Header>
    {children}

    <EditorV2.HeaderTitle>{editor.label}</EditorV2.HeaderTitle>

    <IconButton
      icon={editor.isFullscreen ? 'systemMinimize' : 'systemExpand'}
      onClick={editor.onToggleFullscreen}
      variant={IconButtonVariant.BASIC}
    />
  </EditorV2.Header>
);

export default Header;
