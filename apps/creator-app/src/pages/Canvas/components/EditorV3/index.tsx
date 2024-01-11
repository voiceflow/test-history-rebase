import { SidebarEditor } from '@voiceflow/ui';
import React from 'react';

import { useDropLagFix, useSetup } from '@/hooks';
import perf, { PerfAction } from '@/performance';
import { Identifier } from '@/styles/constants';

import { EditorAnimationEffect } from '../../constants';
import { HeaderActionsV3 } from './components/HeaderActionsV3';
import { useEditor, useEditorV3DefaultActions, useParentMatch } from './hooks';
import * as T from './types';

export * as EditorV3Types from './types';

const EditorV3: React.FC<T.Props> = ({ header, dropLagAccept }) => {
  const dropLagFixRef = useDropLagFix(dropLagAccept ?? []);

  useSetup(() => perf.action(PerfAction.EDITOR_RENDERED));

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
  HeaderActionsV3,
  FooterActionsButton: SidebarEditor.FooterActionsButton,
  HeaderActionsButton: SidebarEditor.HeaderActionsButton,
  FooterActionsContainer: SidebarEditor.FooterActionsContainer,
});
