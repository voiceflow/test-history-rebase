import { SidebarEditor, stopImmediatePropagation } from '@voiceflow/ui';
import React from 'react';

import { useDropLagFix } from '@/hooks/dnd.hook';
import { Identifier } from '@/styles/constants';

import type { IEditorV3 } from './EditorV3.interface';

export const EditorV3: React.FC<IEditorV3> = ({ header, dropLagAccept }) => {
  const dropLagFixRef = useDropLagFix(dropLagAccept ?? []);

  return (
    <SidebarEditor.Container
      id={Identifier.BLOCK_EDITOR}
      ref={!dropLagAccept || !dropLagAccept?.length ? undefined : dropLagFixRef}
      onPaste={stopImmediatePropagation()}
      className="vfui"
    >
      {header}
    </SidebarEditor.Container>
  );
};
