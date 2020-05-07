import React from 'react';

import { Container, EditorContentAnimation, Header } from '@/pages/Canvas/components/Editor';

const Editor = ({ children, hideHeader, animationDistance, ...headerProps }) => (
  <Container>
    {!hideHeader && <Header {...headerProps} />}
    <EditorContentAnimation distance={animationDistance}>{children}</EditorContentAnimation>
  </Container>
);

export default Editor;
