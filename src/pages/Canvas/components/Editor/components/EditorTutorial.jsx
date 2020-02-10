import React from 'react';

import TutorialTooltip from '@/components/TutorialTooltip';

const EditorTutorial = ({ title, anchor, tutorialTitle, helpTitle, helpMessage, children, ...tooltipProps }) => (
  <TutorialTooltip
    {...tooltipProps}
    anchorRenderer={() => anchor || 'How it works?'}
    title={tutorialTitle || `${title} Block Tutorial`}
    helpTitle={helpTitle}
    helpMessage={helpMessage}
  >
    {children}
  </TutorialTooltip>
);

export default EditorTutorial;
