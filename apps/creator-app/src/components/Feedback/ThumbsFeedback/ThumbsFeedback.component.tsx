import { Box, notify, Popper } from '@voiceflow/ui-next';
import React, { useState } from 'react';

import { IThumbsFeedback } from './ThumbsFeedback.interface';
import { ThumbsFeedbackButton } from './ThumbsFeedbackButton.component';

export const ThumbsFeedback: React.FC<IThumbsFeedback> = ({ onBad, onGood, children }) => {
  const [voteType, setVoteType] = useState<'good' | 'bad' | null>(null);

  const onGoodClick = () => {
    onGood?.();
    setVoteType('good');

    notify.short.info('Thanks for your feedback', { showIcon: false });
  };

  const onBadClick = () => {
    onBad?.();
    setVoteType('bad');

    notify.short.info('Thanks for your feedback', { showIcon: false });
  };

  return (
    <Box>
      {children ? (
        <Popper
          placement="bottom-start"
          referenceElement={({ ref, isOpen, onToggle }) => (
            <ThumbsFeedbackButton ref={ref} type="bad" isActive={isOpen} voteType={voteType} onClick={onToggle} />
          )}
        >
          {(props) => children({ ...props, onBadClick })}
        </Popper>
      ) : (
        <ThumbsFeedbackButton type="bad" voteType={voteType} onClick={onBadClick} />
      )}

      <ThumbsFeedbackButton type="good" voteType={voteType} onClick={onGoodClick} />
    </Box>
  );
};
