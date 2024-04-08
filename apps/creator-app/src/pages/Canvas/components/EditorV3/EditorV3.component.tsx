import { SidebarEditor } from '@voiceflow/ui';
import React from 'react';

import { useDropLagFix } from '@/hooks';
import { Identifier } from '@/styles/constants';

import { IEditorV3 } from './EditorV3.interface';

export const EditorV3: React.FC<IEditorV3> = ({ header, dropLagAccept }) => {
  const dropLagFixRef = useDropLagFix(dropLagAccept ?? []);

  return (
    <SidebarEditor.Container id={Identifier.BLOCK_EDITOR} ref={!dropLagAccept || !dropLagAccept?.length ? undefined : dropLagFixRef}>
      {header}
    </SidebarEditor.Container>
  );
};
