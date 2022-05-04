import React from 'react';

import Footer from './Footer';
import Tutorial, { TutorialProps } from './Tutorial';

interface DefaultFooterTutorial extends TutorialProps {
  content: React.ReactNode;
}

interface DefaultFooterProps {
  tutorial?: DefaultFooterTutorial;
}

const DefaultFooter: React.FC<DefaultFooterProps> = ({ tutorial }) => {
  return <Footer>{tutorial ? <Tutorial {...tutorial}>{tutorial.content}</Tutorial> : <div />}</Footer>;
};

export default DefaultFooter;
