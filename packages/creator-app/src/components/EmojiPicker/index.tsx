import React from 'react';

import { useDebouncedCallback } from '@/hooks';

import defaultEmotion from './assets/defaultEmotion.png';
import negativeEmotion from './assets/negativeEmotion.png';
import neutralEmotion from './assets/neutralEmotion.png';
import positiveEmotion from './assets/positiveEmotion.png';
import { Container, EmotionContainer, Option, OptionsContainer, PlaceholderContainer } from './components';
import { FAN_DIRECTION } from './constants';

export enum EMOJI_OPTION {
  HAPPY = 'happy',
  SAD = 'sad',
  NEUTRAL = 'neutral',
  DEFAULT = 'default',
}

export const EMOJI_PNGS = {
  [EMOJI_OPTION.HAPPY]: positiveEmotion,
  [EMOJI_OPTION.SAD]: negativeEmotion,
  [EMOJI_OPTION.NEUTRAL]: neutralEmotion,
  [EMOJI_OPTION.DEFAULT]: defaultEmotion,
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
    50,
    () => {
      setIsHovering(true);
    },
    []
  );

  React.useEffect(() => {
    setCurrentEmotion(value || EMOJI_OPTION.DEFAULT);
  }, [value]);

  // The component for hovering doesnt have padding, so to avoid jarring hover behavior, we wanna have this val a little higher than the onHover one
  const onHoverLeave = useDebouncedCallback(
    50,
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
    <Container fanDirection={fanDirection} onMouseOver={onHover} onMouseLeave={onHoverLeave}>
      <PlaceholderContainer isPlaceholder={currentEmotion === EMOJI_OPTION.DEFAULT}>
        <EmotionContainer src={EMOJI_PNGS[currentEmotion]} />
      </PlaceholderContainer>
      <OptionsContainer fanDirection={fanDirection} length={options.length}>
        {options.map((option, index) => {
          return (
            <Option onClick={() => handleSelect(option)} fanDirection={fanDirection} isHovering={isHovering} number={index} key={index}>
              <EmotionContainer src={EMOJI_PNGS[option]} />
            </Option>
          );
        })}
      </OptionsContainer>
    </Container>
  );
};

export default EmojiPicker;
