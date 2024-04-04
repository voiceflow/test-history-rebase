import React from 'react';

import { Container, EditorContentAnimation, Header, HeaderProps } from '@/pages/Canvas/components/Editor';
import { Identifier } from '@/styles/constants';

interface BlockEditorProps extends HeaderProps, React.PropsWithChildren {
  hideHeader?: boolean;
  animationDistance?: number;
}

const Editor: React.FC<BlockEditorProps> = ({ children, hideHeader, animationDistance, ...headerProps }) => {
  return (
    <Container id={Identifier.BLOCK_EDITOR}>
      {!hideHeader && <Header {...headerProps} />}
      <EditorContentAnimation distance={animationDistance}>{children}</EditorContentAnimation>
    </Container>
  );
};

export default Editor;
