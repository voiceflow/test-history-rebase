import { Box, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { onOpenBookDemoPage } from '@/utils/upgrade';

export type { CardTypes } from './Card';
export { default as Card } from './Card';

export const AIDisabledWrapper: React.FC<React.PropsWithChildren<{ isDisabled: boolean }>> = ({ isDisabled, children }) => {
  if (!isDisabled) return <>{children}</>;

  return (
    <TippyTooltip
      content={
        <Box width={232}>
          <TippyTooltip.FooterButton buttonText="Contact Sales" onClick={onOpenBookDemoPage}>
            This workspace doesn’t have access to this assistant type. To enable access, contact a workspace owner or admin.
          </TippyTooltip.FooterButton>
        </Box>
      }
      interactive
      placement="right-start"
      offset={[0, 5]}
    >
      <div style={{ pointerEvents: 'none', opacity: 0.6, cursor: 'not-allowed' }}>{children}</div>
    </TippyTooltip>
  );
};
