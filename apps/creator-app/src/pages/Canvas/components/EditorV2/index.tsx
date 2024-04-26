import { SidebarEditor } from '@voiceflow/ui';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { useDropLagFix } from '@/hooks';
import { Identifier } from '@/styles/constants';

import { EditorAnimationEffect } from '../../constants';
import {
  AnimatedContent,
  ChipHeader,
  DefaultFooter,
  DefaultHeader,
  PersistCollapse,
  RedirectToRoot,
  Route,
  Tutorial,
} from './components';
import { withGoBack, withRedirectToRoot } from './hocs';
import { useEditor, useEditorDefaultActions, useParentMatch, useSyncDynamicPorts } from './hooks';
import type * as T from './types';

export * as EditorV2Types from './types';

const ANIMATION_DISTANCE = 40;

const EditorV2: React.FC<T.Props> = ({
  header,
  footer,
  children,
  fillHeight,
  dropLagAccept,
  disableAnimation,
  withoutContentContainer,
}) => {
  const { scrollbars } = useEditor();

  const dropLagFixRef = useDropLagFix(dropLagAccept ?? []);

  const { state } = useLocation<{ animationEffect?: EditorAnimationEffect }>();

  const isPopAnimation = state?.animationEffect === EditorAnimationEffect.POP;

  return (
    <SidebarEditor.Container
      id={Identifier.BLOCK_EDITOR}
      ref={!dropLagAccept || !dropLagAccept?.length ? undefined : dropLagFixRef}
    >
      {header}

      <AnimatedContent distance={disableAnimation ? 0 : ANIMATION_DISTANCE * (isPopAnimation ? 1 : -1)}>
        {withoutContentContainer ? (
          children
        ) : (
          <SidebarEditor.Content
            ref={scrollbars}
            $fillHeight={fillHeight}
            autoHeight
            autoHeightMax="100%"
            hideTracksWhenNotNeeded
          >
            {children}
          </SidebarEditor.Content>
        )}

        {footer}
      </AnimatedContent>
    </SidebarEditor.Container>
  );
};

export default Object.assign(EditorV2, {
  useEditor,
  useParentMatch,
  useSyncDynamicPorts,
  useEditorDefaultActions,

  withGoBack,
  withRedirectToRoot,

  AnimationEffect: EditorAnimationEffect,

  Route,
  Footer: SidebarEditor.Footer,
  Header: SidebarEditor.Header,
  Tutorial,
  ChipHeader,
  HeaderTitle: SidebarEditor.HeaderTitle,
  DefaultFooter,
  DefaultHeader,
  RedirectToRoot,
  PersistCollapse,
  FooterActionsButton: SidebarEditor.FooterActionsButton,
  HeaderActionsButton: SidebarEditor.HeaderActionsButton,
  FooterActionsContainer: SidebarEditor.FooterActionsContainer,
});
