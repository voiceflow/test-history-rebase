import { ButtonVariant, ClickableText, TutorialTooltip } from '@voiceflow/ui';
import React from 'react';

import { Controls } from '@/pages/Canvas/components/Editor';

import HelpTooltip from './HelpTooltip';

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
    <TutorialTooltip title="Display Block Tutorial" anchorRenderer={() => <ClickableText>How It Works?</ClickableText>}>
      <HelpTooltip />
    </TutorialTooltip>
  </Controls>
);

export default Footer;
