import { SidebarEditor } from '@voiceflow/ui';
import React from 'react';

import { useDropLagFix } from '@/hooks';
import { Identifier } from '@/styles/constants';

import { EditorAnimationEffect } from '../../constants';
import { HeaderActions, Sidebar } from './components';
import { useEditor, useEditorV3DefaultActions, useParentMatch } from './hooks';
import * as T from './types';

export * as EditorV3Types from './types';

const EditorV3: React.FC<T.Props> = ({ header, dropLagAccept }) => {
  const dropLagFixRef = useDropLagFix(dropLagAccept ?? []);

  return (
    <SidebarEditor.Container id={Identifier.BLOCK_EDITOR} ref={!dropLagAccept || !dropLagAccept?.length ? undefined : dropLagFixRef}>
      {header}
    </SidebarEditor.Container>
  );
};

export default Object.assign(EditorV3, {
  useEditor,
  useParentMatch,
  useEditorV3DefaultActions,

  AnimationEffect: EditorAnimationEffect,

  Footer: SidebarEditor.Footer,
  Header: SidebarEditor.Header,
  HeaderTitle: SidebarEditor.HeaderTitle,
  FooterActionsButton: SidebarEditor.FooterActionsButton,
  HeaderActionsButton: SidebarEditor.HeaderActionsButton,
  FooterActionsContainer: SidebarEditor.FooterActionsContainer,

  HeaderActions,
  Sidebar,
});
