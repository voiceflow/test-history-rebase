import React from 'react';

import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { CommentModeContext, EditPermissionContext, MarkupModeContext } from '@/pages/Skill/contexts';
import { FadeDownContainer } from '@/styles/animations';
import { ConnectedProps } from '@/types';

import { CenterContainer, Container, KeyBubble } from './components';

const fadeConfig = {
  height: -30,
  duration: 0.4,
  animationFunction: 'ease',
};
const TopPrompt: React.FC<ConnectedTopPrompt> = ({ goToDesign }) => {
  const commenting: { isOpen: boolean; close: () => void } = React.useContext(CommentModeContext);
  const markup: { isOpen: boolean; closeTool: () => void } | null = React.useContext(MarkupModeContext);
  const editPermission = React.useContext(EditPermissionContext)!;
  let modeText = '';
  const show = commenting.isOpen || markup?.isOpen || editPermission.isPrototyping;
  let onClick: () => void;

  if (commenting.isOpen) {
    modeText = 'commenting';
    onClick = commenting.close;
  } else if (markup?.isOpen) {
    modeText = 'markup';
    onClick = markup.closeTool;
  } else if (editPermission.isPrototyping) {
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
