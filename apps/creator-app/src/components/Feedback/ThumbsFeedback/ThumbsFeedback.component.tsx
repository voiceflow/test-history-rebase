import composeRefs from '@seznam/compose-react-refs';
import { Box, Popper, PopperReferenceProps, SquareButton, Text, Tokens, Tooltip } from '@voiceflow/ui-next';
import React, { useState } from 'react';

import { buttonContainerStyle, buttonIconStyle } from './ThumbsFeedback.css';
import { IThumbsFeedback } from './ThumbsFeedback.interface';

export const ThumbsFeedback: React.FC<IThumbsFeedback> = ({ onBad, onGood, children }) => {
  const [voteType, setVoteType] = useState<'good' | 'bad' | null>(null);

  const onGoodClick = () => {
    onGood?.();
    setVoteType('good');
  };

  const onBadClick = () => {
    onBad?.();
    setVoteType('bad');
  };

  const renderBadButton = (popper?: PopperReferenceProps) => (
    <Tooltip
      placement="top"
      referenceElement={(tooltip) => (
        <Box className={buttonContainerStyle({ type: 'bad', voted: !!voteType, voteDestination: voteType === 'bad' })}>
          <SquareButton
            ref={composeRefs(popper?.ref, tooltip.ref)}
            size="medium"
            onClick={popper?.onToggle ?? onBadClick}
            isActive={popper?.isOpen}
            iconName="Minus"
            onMouseEnter={tooltip.onOpen}
            onMouseLeave={tooltip.onClose}
            iconClassName={buttonIconStyle({ type: 'bad', voted: voteType === 'bad' })}
          />
        </Box>
      )}
    >
      {() => (
        <Text variant="caption">
          Feedback →{' '}
          <Text as="span" variant="caption" color={Tokens.colors.alert.alert300}>
            Bad
          </Text>
        </Text>
      )}
    </Tooltip>
  );

  return (
    <Box>
      {children ? (
        <Popper placement="bottom-start" referenceElement={renderBadButton}>
          {(props) => children({ ...props, onBadClick })}
        </Popper>
      ) : (
        renderBadButton()
      )}

      <Tooltip
        placement="top"
        referenceElement={(tooltip) => (
          <Box pl={8} className={buttonContainerStyle({ type: 'good', voted: !!voteType, voteDestination: voteType === 'good' })}>
            <SquareButton
              ref={tooltip.ref}
              size="medium"
              onClick={onGoodClick}
              iconName="Plus"
              onMouseEnter={tooltip.onOpen}
              onMouseLeave={tooltip.onClose}
              iconClassName={buttonIconStyle({ type: 'good', voted: voteType === 'good' })}
            />
          </Box>
        )}
      >
        {() => (
          <Text variant="caption">
            Feedback →{' '}
            <Text as="span" variant="caption" color={Tokens.colors.success.success200}>
              Good
            </Text>
          </Text>
        )}
      </Tooltip>
    </Box>
  );
};
