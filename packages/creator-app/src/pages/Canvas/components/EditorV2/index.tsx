import React from 'react';
import { useLocation } from 'react-router-dom';

import { useSetup } from '@/hooks';
import perf, { PerfAction } from '@/performance';
import { Identifier } from '@/styles/constants';

import { EditorAnimationEffect } from '../../constants';
import {
  AnimatedContent,
  Container,
  Content,
  DefaultFooter,
  DefaultHeader,
  Footer,
  FooterActionsButton,
  FooterActionsContainer,
  Header,
  HeaderActionsButton,
  PersistCollapse,
  RedirectToRoot,
  Tutorial,
} from './components';
import { withGoBack, withRedirectToRoot } from './hocs';
import { useEditor, useEditorDefaultActions, useSyncDynamicPorts } from './hooks';

interface EditorV2Props {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  fillHeight?: boolean;
  disableAnimation?: boolean;
  withoutContentContainer?: boolean;
}

const ANIMATION_DISTANCE = 40;

const EditorV2: React.FC<EditorV2Props> = ({ header, footer, children, fillHeight, disableAnimation, withoutContentContainer }) => {
  const { scrollbars } = useEditor();

  const { state } = useLocation<{ animationEffect?: EditorAnimationEffect }>();

  useSetup(() => perf.action(PerfAction.EDITOR_RENDERED));

  const isPopAnimation = state?.animationEffect === EditorAnimationEffect.POP;

  return (
    <Container id={Identifier.BLOCK_EDITOR}>
      {header}

      <AnimatedContent distance={disableAnimation ? 0 : ANIMATION_DISTANCE * (isPopAnimation ? 1 : -1)}>
        {withoutContentContainer ? (
          children
        ) : (
          <Content ref={scrollbars} $fillHeight={fillHeight} autoHeight autoHeightMax="100%" hideTracksWhenNotNeeded>
            {children}
          </Content>
        )}

        {footer}
      </AnimatedContent>
    </Container>
  );
};

export default Object.assign(EditorV2, {
  useEditor,
  useSyncDynamicPorts,
  useEditorDefaultActions,

  withGoBack,
  withRedirectToRoot,

  AnimationEffect: EditorAnimationEffect,

  Footer,
  Header,
  Tutorial,
  DefaultFooter,
  DefaultHeader,
  RedirectToRoot,
  PersistCollapse,
  FooterActionsButton,
  HeaderActionsButton,
  FooterActionsContainer,
});
