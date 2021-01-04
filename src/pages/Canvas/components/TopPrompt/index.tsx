import React from 'react';

import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useCommentingMode, useMarkupMode, usePrototypingMode } from '@/pages/Skill/hooks';
import { FadeDownContainer } from '@/styles/animations';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { CenterContainer, Container, KeyBubble } from './components';

const fadeConfig = {
  height: -30,
  duration: 0.4,
  animationFunction: 'ease',
};

const TopPrompt: React.FC<ConnectedTopPrompt> = ({ goToDesign }) => {
  const isPrototypingMode = usePrototypingMode();
  const isCommentingMode = useCommentingMode();
  const isMarkupMode = useMarkupMode();

  let modeText = '';

  if (isCommentingMode) {
    modeText = 'commenting';
  } else if (isMarkupMode) {
    modeText = 'markup';
  } else if (isPrototypingMode) {
    modeText = 'prototyping';
  }

  useHotKeys(Hotkey.CLOSE_CANVAS_MODE, goToDesign, { preventDefault: true });

  return (
    <CenterContainer>
      <FadeDownContainer {...fadeConfig}>
        <Container id={Identifier.ESCAPE_MODE_PROMPT} onClick={goToDesign}>
          <KeyBubble>esc</KeyBubble> to exit {modeText}
        </Container>
      </FadeDownContainer>
    </CenterContainer>
  );
};

const mapDispatchToProps = {
  goToDesign: Router.goToCurrentCanvas,
};

type ConnectedTopPrompt = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(TopPrompt);
