import type { TutorialTooltipProps } from '@voiceflow/ui';
import { TutorialTooltip } from '@voiceflow/ui';
import React from 'react';

import { useEditor } from '../hooks';

export interface TutorialProps extends Partial<TutorialTooltipProps> {}

const Tutorial: React.FC<TutorialProps> = ({ title, children, anchorRenderer, ...tooltipProps }) => {
  const editor = useEditor();

  return (
    <TutorialTooltip
      {...tooltipProps}
      title={title || `${editor.label} Block Tutorial`}
      anchorRenderer={anchorRenderer ?? (() => 'How it works?')}
    >
      {children}
    </TutorialTooltip>
  );
};

export default Tutorial;
