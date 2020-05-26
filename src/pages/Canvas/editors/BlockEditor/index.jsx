import React from 'react';

import { Container, EditorContentAnimation, Header } from '@/pages/Canvas/components/Editor';
import { Identifier } from '@/styles/constants';

const Editor = ({ children, hideHeader, animationDistance, ...headerProps }) => (
  <Container id={Identifier.BLOCK_EDITOR}>
    {!hideHeader && <Header {...headerProps} />}
    <EditorContentAnimation distance={animationDistance}>{children}</EditorContentAnimation>
  </Container>
);

export default Editor;
