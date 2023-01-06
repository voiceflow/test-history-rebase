import React from 'react';

import { Container, EditorContentAnimation } from '@/pages/Canvas/components/Editor';

interface EditorProps {
  animationDistance?: number;
}

const Editor: React.OldFC<EditorProps> = ({ children, animationDistance }) => (
  <Container>
    <EditorContentAnimation distance={animationDistance}>{children}</EditorContentAnimation>
  </Container>
);

export default Editor;
