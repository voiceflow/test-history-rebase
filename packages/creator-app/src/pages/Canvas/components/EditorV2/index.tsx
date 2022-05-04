import React from 'react';
import { useLocation } from 'react-router-dom';

import { useSetup } from '@/hooks';
import perf, { PerfAction } from '@/performance';
import { Identifier } from '@/styles/constants';

import { EditorAnimationEffect } from '../../constants';
import { ActionsButton, AnimatedContent, Container, Content, DefaultFooter, DefaultHeader, Footer, Header, Tutorial } from './components';
import { useEditor } from './hooks';

interface EditorV2Props {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  fillHeight?: boolean;
}

const ANIMATION_DISTANCE = 40;

const EditorV2: React.FC<EditorV2Props> = ({ header, footer, children, fillHeight }) => {
  const { scrollbars } = useEditor();

  const { state } = useLocation<{ animationEffect?: EditorAnimationEffect }>();

  useSetup(() => perf.action(PerfAction.EDITOR_RENDERED));

  const isPopAnimation = state?.animationEffect === EditorAnimationEffect.POP;

  return (
    <Container id={Identifier.BLOCK_EDITOR}>
      {header}

      <AnimatedContent distance={ANIMATION_DISTANCE * (isPopAnimation ? 1 : -1)}>
        <Content ref={scrollbars} $fillHeight={fillHeight} autoHeight autoHeightMax="100%" hideTracksWhenNotNeeded>
          {children}
        </Content>

        {footer}
      </AnimatedContent>
    </Container>
  );
};

export default Object.assign(EditorV2, {
  useEditor,
  AnimationEffect: EditorAnimationEffect,

  Footer,
  Header,
  Tutorial,
  ActionsButton,
  DefaultFooter,
  DefaultHeader,
});
