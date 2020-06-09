import React from 'react';

import { CommentModeContext } from '@/pages/Skill/contexts';
import { FadeDownContainer } from '@/styles/animations';

import { CenterContainer, Container, KeyBubble } from './components';

const fadeConfig = {
  height: -30,
  duration: 0.4,
  animationFunction: 'ease',
};
const TopPrompt = () => {
  const commenting = React.useContext(CommentModeContext);

  return (
    <>
      {commenting.isOpen && (
        <CenterContainer>
          <FadeDownContainer {...fadeConfig}>
            <Container>
              <KeyBubble>esc</KeyBubble> to exit commenting
            </Container>
          </FadeDownContainer>
        </CenterContainer>
      )}
    </>
  );
};

export default TopPrompt;
