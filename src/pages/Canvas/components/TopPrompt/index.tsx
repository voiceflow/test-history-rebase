import React from 'react';

import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { MarkupModeContext } from '@/pages/Skill/contexts';
import { useCommentingMode, usePrototypingMode } from '@/pages/Skill/hooks';
import { FadeDownContainer } from '@/styles/animations';
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
  const markup: { isOpen: boolean; closeTool: () => void } | null = React.useContext(MarkupModeContext);
  const show = isCommentingMode || markup?.isOpen || isPrototypingMode;

  let onClick: () => void;
  let modeText = '';

  if (isCommentingMode) {
    modeText = 'commenting';
    onClick = goToDesign;
  } else if (markup?.isOpen) {
    modeText = 'markup';
    onClick = markup.closeTool;
  } else if (isPrototypingMode) {
    modeText = 'prototyping';
    onClick = goToDesign;
  }

  return (
    <>
      {show && (
        <CenterContainer>
          <FadeDownContainer {...fadeConfig}>
            <Container onClick={() => onClick?.()}>
              <KeyBubble>esc</KeyBubble> to exit {modeText}
            </Container>
          </FadeDownContainer>
        </CenterContainer>
      )}
    </>
  );
};

const mapDispatchToProps = {
  goToDesign: Router.goToCurrentCanvas,
};

type ConnectedTopPrompt = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(TopPrompt);
