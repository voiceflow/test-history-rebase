import { Icon, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { useDebouncedCallback } from '@/hooks';

import { Container, Option, OptionsContainer, PlaceholderContainer } from './components';
import { FAN_DIRECTION } from './constants';
// Shouldn't change this, the component isnt designed in a way where this can be modified easily yet
const EMOJI_SIZE = 24;

export enum EMOJI_OPTION {
  HAPPY = 'happy',
  SAD = 'sad',
  NEUTRAL = 'neutral',
  DEFAULT = 'default',
}

export const EMOJI_SVGS: Record<EMOJI_OPTION, Icon> = {
  [EMOJI_OPTION.HAPPY]: 'positiveEmotion',
  [EMOJI_OPTION.SAD]: 'negativeEmotion',
  [EMOJI_OPTION.NEUTRAL]: 'neutralEmotion',
  [EMOJI_OPTION.DEFAULT]: 'defaultEmotion',
};

interface EmojiPickerProps {
  options: EMOJI_OPTION[];
  fanDirection: FAN_DIRECTION;
  onChange: (option: EMOJI_OPTION) => void;
  value: EMOJI_OPTION | null;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onChange, value, fanDirection, options }) => {
  const [isHovering, setIsHovering] = React.useState(false);
  const [currentEmotion, setCurrentEmotion] = React.useState(value || EMOJI_OPTION.DEFAULT);
  const onHover = useDebouncedCallback(
    100,
    () => {
      setIsHovering(true);
    },
    []
  );

  React.useEffect(() => {
    setCurrentEmotion(value || EMOJI_OPTION.DEFAULT);
  }, [value]);

  const onHoverLeave = useDebouncedCallback(
    100,
    () => {
      setIsHovering(false);
    },
    []
  );

  const handleSelect = (option: EMOJI_OPTION) => {
    if (currentEmotion === option) {
      setCurrentEmotion(EMOJI_OPTION.DEFAULT);
      onChange(EMOJI_OPTION.DEFAULT);
    } else {
      setCurrentEmotion(option);
      onChange(option);
    }
    setIsHovering(false);
  };

  return (
    <Container onMouseOver={onHover} onMouseLeave={onHoverLeave}>
      <PlaceholderContainer isPlaceholder={currentEmotion === EMOJI_OPTION.DEFAULT}>
        <SvgIcon size={EMOJI_SIZE} icon={EMOJI_SVGS[currentEmotion]} />
      </PlaceholderContainer>
      <OptionsContainer fanDirection={fanDirection} length={options.length}>
        {options.map((option, index) => {
          return (
            <Option onClick={() => handleSelect(option)} fanDirection={fanDirection} isHovering={isHovering} number={index} key={index}>
              <SvgIcon size={EMOJI_SIZE} icon={EMOJI_SVGS[option]} />
            </Option>
          );
        })}
      </OptionsContainer>
    </Container>
  );
};

export default EmojiPicker;
