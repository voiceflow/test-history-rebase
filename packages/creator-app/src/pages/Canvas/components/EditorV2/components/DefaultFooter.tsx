import { Link, SidebarEditor } from '@voiceflow/ui';
import React from 'react';

import Tutorial, { TutorialProps } from './Tutorial';

interface DefaultFooterTutorial extends TutorialProps {
  content: React.ReactNode;
}

interface DefaultFooterProps {
  tutorial?: DefaultFooterTutorial | string;
}

const DefaultFooter: React.FC<DefaultFooterProps> = ({ tutorial, children }) => (
  <SidebarEditor.Footer>
    {(tutorial &&
      (typeof tutorial === 'string' ? <Link href={tutorial}>How it works?</Link> : <Tutorial {...tutorial}>{tutorial.content}</Tutorial>)) || <div />}

    {children ? <SidebarEditor.FooterActionsContainer>{children}</SidebarEditor.FooterActionsContainer> : null}
  </SidebarEditor.Footer>
);

export default DefaultFooter;
