import { Utils } from '@voiceflow/common';
import { Intent } from '@voiceflow/dtos';
import { Divider } from '@voiceflow/ui-next';
import React from 'react';

import { ThumbsFeedback } from '@/components/Feedback/ThumbsFeedback/ThumbsFeedback.component';
import { IntentMenu } from '@/components/Intent/IntentMenu/IntentMenu.component';

export const IntentPreviewFeedback: React.FC = () => {
  const onIntentSelect = (intent: Intent) => {
    // TODO: add tracking event
  };

  const onGood = () => {
    // TODO: add tracking event
  };

  return (
    <ThumbsFeedback onGood={onGood}>
      {({ onClose, onBadClick }) => (
        <IntentMenu
          onClose={onClose}
          onSelect={Utils.functional.chain(onIntentSelect, onBadClick)}
          viewOnly
          header={<Divider label="Select correct intent" fullWidth={false} />}
        />
      )}
    </ThumbsFeedback>
  );
};
