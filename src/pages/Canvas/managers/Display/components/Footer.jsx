import React from 'react';

import ClickableText from '@/components/Text/ClickableText';
import TutorialTooltip from '@/components/TutorialTooltip';
import { Controls } from '@/pages/Canvas/components/Editor';

import HelpTooltip from './HelpTooltip';

function Footer({ canRenderPreview, openPreviewModal }) {
  return (
    <Controls
      options={[
        {
          label: 'Create Preview',
          onClick: openPreviewModal,
          variant: 'secondary',
          disabled: !canRenderPreview,
        },
      ]}
    >
      <TutorialTooltip anchorRenderer={() => <ClickableText>How It Works?</ClickableText>} title="Display Block Tutorial">
        <HelpTooltip />
      </TutorialTooltip>
    </Controls>
  );
}

export default Footer;
