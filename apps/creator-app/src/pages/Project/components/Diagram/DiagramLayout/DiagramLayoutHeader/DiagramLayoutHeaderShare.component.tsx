import { tid } from '@voiceflow/style';
import { Header } from '@voiceflow/ui-next';
import React from 'react';

import SharePopper from '@/pages/Project/components/SharePopper';

export const DiagramLayoutHeaderShare: React.FC = () => {
  return (
    <SharePopper placement="bottom-start" modifiers={{ offset: { offset: '0,1' } }} preventOverflowPadding={16}>
      {({ ref, onToggle, isOpened }) => (
        <div ref={ref}>
          <Header.Button.Secondary
            label="Share"
            isActive={isOpened}
            onClick={() => onToggle()}
            testID={tid('canvas-header', 'share')}
          />
        </div>
      )}
    </SharePopper>
  );
};
