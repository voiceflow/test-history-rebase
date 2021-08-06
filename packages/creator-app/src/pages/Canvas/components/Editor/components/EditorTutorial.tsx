import React from 'react';

import TutorialTooltip from '@/components/TutorialTooltip';

export interface EditorTutorialProps {
  title: React.ReactNode;
  anchor: React.ReactNode;
  helpTitle?: React.ReactNode;
  helpMessage?: React.ReactNode;
  tutorialTitle: React.ReactNode;
}

const TutorialTooltipAny = TutorialTooltip as any;

const EditorTutorial: React.FC<EditorTutorialProps> = ({ title, anchor, tutorialTitle, helpTitle, helpMessage, children, ...tooltipProps }) => (
  <TutorialTooltipAny
    {...tooltipProps}
    title={tutorialTitle || `${title} Block Tutorial`}
    helpTitle={helpTitle}
    helpMessage={helpMessage}
    anchorRenderer={() => anchor || 'How it works?'}
  >
    {children}
  </TutorialTooltipAny>
);

export default EditorTutorial;
