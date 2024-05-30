import { SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { CUSTOM_BLOCK_EDITOR } from '@/config/documentation';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

export const Tooltip: React.FC = () => (
  <TippyTooltip
    width={232}
    placement="top"
    interactive
    content={
      <TippyTooltip.FooterButton buttonText="More" onClick={onOpenInternalURLInANewTabFactory(CUSTOM_BLOCK_EDITOR)}>
        <TippyTooltip.Title>Custom Blocks</TippyTooltip.Title>
        Add custom blocks that can be re-used and configured per instance in your agent.
      </TippyTooltip.FooterButton>
    }
  >
    <SvgIcon size={16} icon="info" color="currentColor" variant={SvgIcon.Variant.STANDARD} clickable reducedOpacity />
  </TippyTooltip>
);
