import { Utils } from '@voiceflow/common';
import type { Intent, IntentClassificationSettings } from '@voiceflow/dtos';
import { Box, Divider } from '@voiceflow/ui-next';
import React from 'react';

import { ThumbsFeedback } from '@/components/Feedback/ThumbsFeedback/ThumbsFeedback.component';
import { IntentMenu } from '@/components/Intent/IntentMenu/IntentMenu.component';
import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';

interface IIntentPreviewFeedback {
  settings: IntentClassificationSettings;
  utterance: string;
  classifiedIntents: { nlu: Array<{ name: string; confidence: number }>; llm: Array<{ name: string }> };
}

export const IntentPreviewFeedback: React.FC<IIntentPreviewFeedback> = ({ settings, utterance, classifiedIntents }) => {
  const previewUtteranceFeedback = useDispatch(Designer.Intent.tracking.previewUtteranceFeedback);

  const onIntentSelect = (intent: Intent) => {
    previewUtteranceFeedback({
      type: 'thumbs_down',
      settings,
      utterance,
      userIntent: intent.name,
      llmClassified: classifiedIntents.llm,
      nluClassified: classifiedIntents.nlu,
    });
  };

  const onGood = () => {
    previewUtteranceFeedback({
      type: 'thumbs_up',
      settings,
      utterance,
      llmClassified: classifiedIntents.llm,
      nluClassified: classifiedIntents.nlu,
    });
  };

  return (
    <ThumbsFeedback onGood={onGood}>
      {({ onClose, onBadClick }) => (
        <IntentMenu
          onClose={onClose}
          onSelect={Utils.functional.chain(onIntentSelect, onBadClick)}
          viewOnly
          header={
            <Box pt={4}>
              <Divider label="Select correct intent" fullWidth={false} />
            </Box>
          }
        />
      )}
    </ThumbsFeedback>
  );
};
