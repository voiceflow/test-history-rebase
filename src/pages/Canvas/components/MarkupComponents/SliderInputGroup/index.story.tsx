import { text } from '@storybook/addon-knobs';
import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import SliderInputGroup from '.';

export default {
  title: 'Creator/Markup Components/Slider Input Group',
  component: SliderInputGroup,
};

const createStory = () => () => {
  const [inputValue, setInputValue] = React.useState('1');
  const [sliderValue, setSliderValue] = React.useState(0);

  return (
    <div style={{ maxWidth: '296px', margin: '50px auto' }}>
      <SliderInputGroup
        inputValue={inputValue}
        sliderValue={sliderValue}
        inputAction={text('InputAction', '%')}
        sliderPrefix={<SvgIcon size={16} icon="textAlignCenter" />}
        onChangeInput={({ target }) => setInputValue(target.value)}
        onChangeSlider={setSliderValue}
      />
    </div>
  );
};

export const normal = createStory();
