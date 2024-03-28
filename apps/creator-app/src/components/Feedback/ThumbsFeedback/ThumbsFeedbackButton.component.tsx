import composeRefs from '@seznam/compose-react-refs';
import { Box, forwardRef, SquareButton, Text, Tokens, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { buttonContainerStyle, buttonIconStyle } from './ThumbsFeedback.css';
import { IThumbsFeedbackButton } from './ThumbsFeedback.interface';

export const ThumbsFeedbackButton = forwardRef<HTMLButtonElement, IThumbsFeedbackButton>('ThumbsFeedbackButton')(
  ({ type, onClick, voteType, isActive }, ref) => (
    <Tooltip
      placement="top"
      referenceElement={(tooltip) => (
        <Box pl={type === 'good' ? 8 : 0} className={buttonContainerStyle({ type, voted: !!voteType, voteDestination: voteType === type })}>
          <SquareButton
            ref={composeRefs(ref, tooltip.ref)}
            size="medium"
            onClick={onClick}
            isActive={isActive}
            iconName={type === 'bad' ? 'ThumbsDown' : 'ThumbsUp'}
            onMouseEnter={tooltip.onOpen}
            onMouseLeave={tooltip.onClose}
            iconClassName={buttonIconStyle({ type, voted: voteType === type })}
          />
        </Box>
      )}
    >
      {() => (
        <Text variant="caption">
          Feedback →{' '}
          <Text as="span" variant="caption" color={type === 'bad' ? Tokens.colors.alert.alert300 : Tokens.colors.success.success200}>
            {type === 'bad' ? 'Bad' : 'Good'}
          </Text>
        </Text>
      )}
    </Tooltip>
  )
);
