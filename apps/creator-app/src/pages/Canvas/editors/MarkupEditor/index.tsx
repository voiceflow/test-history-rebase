import React from 'react';

import { Container, EditorContentAnimation } from '@/pages/Canvas/components/Editor';

interface EditorProps extends React.PropsWithChildren {
  animationDistance?: number;
}

const Editor: React.FC<EditorProps> = ({ children, animationDistance }) => (
  <Container>
    <EditorContentAnimation distance={animationDistance}>{children}</EditorContentAnimation>
  </Container>
);

export default Editor;
