import * as Realtime from '@voiceflow/realtime-sdk';
import { tid } from '@voiceflow/style';
import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { useFeature } from '@/hooks/feature';
import SharePopper from '@/pages/Project/components/Header/components/SharePopper';

export const DiagramLayoutHeaderShare: React.FC = () => {
  const hideExports = useFeature(Realtime.FeatureFlag.HIDE_EXPORTS);

  return !hideExports.isEnabled ? (
    <SharePopper placement="bottom-start" modifiers={{ offset: { offset: '0,1' } }} preventOverflowPadding={16}>
      {({ ref, onToggle, isOpened }) => (
        <div ref={ref}>
          <Header.Button.Secondary label="Share" isActive={isOpened} onClick={() => onToggle()} testID={tid('canvas-header', 'share')} />
        </div>
      )}
    </SharePopper>
  ) : null;
};
