import React from 'react';

import Footer from './Footer';
import FooterActionsContainer from './FooterActionsContainer';
import Tutorial, { TutorialProps } from './Tutorial';

interface DefaultFooterTutorial extends TutorialProps {
  content: React.ReactNode;
}

interface DefaultFooterProps {
  tutorial?: DefaultFooterTutorial;
}

const DefaultFooter: React.FC<DefaultFooterProps> = ({ tutorial, children }) => (
  <Footer>
    {tutorial ? <Tutorial {...tutorial}>{tutorial.content}</Tutorial> : <div />}
    {children ? <FooterActionsContainer>{children}</FooterActionsContainer> : null}
  </Footer>
);

export default DefaultFooter;
