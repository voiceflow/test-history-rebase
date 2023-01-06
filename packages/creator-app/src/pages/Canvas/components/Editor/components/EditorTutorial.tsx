import { TutorialTooltip } from '@voiceflow/ui';
import React from 'react';

export interface EditorTutorialProps {
  title: React.ReactNode;
  anchor: React.ReactNode;
  helpTitle?: React.ReactNode;
  helpMessage?: React.ReactNode;
  tutorialTitle: React.ReactNode;
}

const EditorTutorial: React.OldFC<EditorTutorialProps> = ({ title, anchor, tutorialTitle, helpTitle, helpMessage, children, ...tooltipProps }) => (
  <TutorialTooltip
    {...tooltipProps}
    title={tutorialTitle || `${title} Block Tutorial`}
    helpTitle={helpTitle}
    helpMessage={helpMessage}
    anchorRenderer={() => anchor || 'How it works?'}
  >
    {children}
  </TutorialTooltip>
);

export default EditorTutorial;
