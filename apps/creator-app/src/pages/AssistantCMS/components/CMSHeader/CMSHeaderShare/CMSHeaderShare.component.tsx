import * as Realtime from '@voiceflow/realtime-sdk';
import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { useFeature } from '@/hooks';
import SharePopper from '@/pages/Project/components/Header/components/SharePopper';

export const CMSHeaderShare: React.FC = () => {
  const hideExports = useFeature(Realtime.FeatureFlag.HIDE_EXPORTS);

  return !hideExports.isEnabled ? (
    <SharePopper placement="bottom-start" modifiers={{ offset: { offset: '0,1' } }} preventOverflowPadding={16}>
      {({ ref, onToggle, isOpened }) => (
        <div ref={ref}>
          <Header.Button.Secondary label="Share" isActive={isOpened} onClick={() => onToggle()} />
        </div>
      )}
    </SharePopper>
  ) : null;
};
