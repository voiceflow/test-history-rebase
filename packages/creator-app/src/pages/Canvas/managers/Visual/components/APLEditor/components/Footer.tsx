import { ButtonVariant, ClickableText } from '@voiceflow/ui';
import React from 'react';

import TutorialTooltip from '@/components/TutorialTooltip';
import { Controls } from '@/pages/Canvas/components/Editor';

import HelpTooltip from './HelpTooltip';

const AnyTutorialTooltip = TutorialTooltip as any;

interface FooterProps {
  canRenderPreview?: boolean;
  openPreviewModal: () => void;
}

const Footer: React.FC<FooterProps> = ({ canRenderPreview, openPreviewModal }) => (
  <Controls
    options={[
      {
        label: 'Create Preview',
        onClick: openPreviewModal,
        variant: ButtonVariant.SECONDARY,
        disabled: !canRenderPreview,
      },
    ]}
  >
    <AnyTutorialTooltip anchorRenderer={() => <ClickableText>How It Works?</ClickableText>} title="Display Block Tutorial">
      <HelpTooltip />
    </AnyTutorialTooltip>
  </Controls>
);

export default Footer;
