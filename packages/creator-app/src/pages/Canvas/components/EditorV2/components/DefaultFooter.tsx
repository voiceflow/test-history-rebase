import { Link } from '@voiceflow/ui';
import React from 'react';

import Footer from './Footer';
import FooterActionsContainer from './FooterActionsContainer';
import Tutorial, { TutorialProps } from './Tutorial';

interface DefaultFooterTutorial extends TutorialProps {
  content: React.ReactNode;
}

interface DefaultFooterProps {
  tutorial?: DefaultFooterTutorial | string;
}

const DefaultFooter: React.FC<DefaultFooterProps> = ({ tutorial, children }) => (
  <Footer>
    {(tutorial &&
      (typeof tutorial === 'string' ? <Link href={tutorial}>How it works?</Link> : <Tutorial {...tutorial}>{tutorial.content}</Tutorial>)) || <div />}
    {children ? <FooterActionsContainer>{children}</FooterActionsContainer> : null}
  </Footer>
);

export default DefaultFooter;
