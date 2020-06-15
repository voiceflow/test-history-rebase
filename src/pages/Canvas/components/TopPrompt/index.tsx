import React from 'react';

import { CommentModeContext, MarkupModeContext } from '@/pages/Skill/contexts';
import { FadeDownContainer } from '@/styles/animations';

import { CenterContainer, Container, KeyBubble } from './components';

const fadeConfig = {
  height: -30,
  duration: 0.4,
  animationFunction: 'ease',
};
const TopPrompt = () => {
  const commenting: { isOpen: boolean } = React.useContext(CommentModeContext);
  const markup: { isOpen: boolean } | null = React.useContext(MarkupModeContext);

  let modeText = '';
  const show = commenting.isOpen || markup?.isOpen;

  if (commenting.isOpen) {
    modeText = 'commenting';
  } else if (markup?.isOpen) {
    modeText = 'markup';
  }

  return (
    <>
      {show && (
        <CenterContainer>
          <FadeDownContainer {...fadeConfig}>
            <Container>
              <KeyBubble>esc</KeyBubble> to exit {modeText}
            </Container>
          </FadeDownContainer>
        </CenterContainer>
      )}
    </>
  );
};

export default TopPrompt;
