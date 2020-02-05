import React from 'react';

import ClickableText from '@/componentsV2/Text/ClickableText';
import TutorialTooltip from '@/componentsV2/TutorialTooltip';
import { Controls } from '@/containers/CanvasV2/components/Editor';

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
