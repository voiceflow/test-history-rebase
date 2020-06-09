import React from 'react';

import SliderInputGroup from '@/components/SliderInputGroup';
import SvgIcon from '@/components/SvgIcon';
import { useDebouncedCallback } from '@/hooks';
import { Markup } from '@/models';
import Section from '@/pages/Canvas/components/MarkupSection';
import { DEFAULT_MARKUP_BACKGROUND_COLOR, DEFAULT_MARKUP_BORDER_COLOR } from '@/pages/Canvas/constants';

import { EditorProps } from '../types';
import { ColorSection } from './components';
import { UPDATE_DATA_TIMEOUT } from './constants';

const RectangleEditor: React.FC<EditorProps<Markup.NodeData.Rectangle>> = ({ onChange, data }) => {
  const { width, height, borderColor, borderRadius, backgroundColor } = data;

  const [inputBorderRadius, setInputBorderRadius] = React.useState(`${borderRadius}`);

  const maxBorderRadius = React.useMemo(() => Math.floor(Math.max(width, height)) / 2, [width, height]);

  const onPartialChange = (partialData: Partial<Markup.NodeData.Rectangle>) => onChange({ ...data, ...partialData });

  const onPartialChangeRef = React.useRef(onPartialChange);

  onPartialChange.current = onPartialChange;

  const onChangeBorderRadiusDebounced = useDebouncedCallback(
    UPDATE_DATA_TIMEOUT,
    (radius: number) => onPartialChangeRef.current({ borderRadius: radius }),
    []
  );

  const onChangeOpacitySlider = (value: number) => {
    setInputBorderRadius(`${value}`);
    onChangeBorderRadiusDebounced(value);
  };

  const onChangeBorderRadiusInput = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (value === '') {
      setInputBorderRadius(value);
    } else if (value.match(/^\d+$/)) {
      const radius = Math.max(Math.min(+value, maxBorderRadius), 0);

      setInputBorderRadius(`${radius}`);
      onChangeBorderRadiusDebounced(radius);
    }
  };

  const onBlurBorderRadiusInput = () => {
    if (inputBorderRadius === '') {
      setInputBorderRadius(`${borderRadius}`);
    }
  };

  return (
    <>
      <ColorSection
        title="Border"
        color={borderColor}
        initialColor={DEFAULT_MARKUP_BORDER_COLOR}
        onChange={(color) => onChange({ ...data, borderColor: color })}
      />

      <ColorSection
        title="Fill"
        color={backgroundColor}
        initialColor={DEFAULT_MARKUP_BACKGROUND_COLOR}
        onChange={(color) => onChange({ ...data, backgroundColor: color })}
      />

      <Section isLast>
        <SliderInputGroup
          inputValue={inputBorderRadius}
          inputProps={{ onBlur: onBlurBorderRadiusInput, placeholder: maxBorderRadius }}
          sliderValue={+inputBorderRadius}
          inputAction={undefined}
          sliderProps={{ min: 0, max: maxBorderRadius }}
          sliderPrefix={<SvgIcon icon="angle" color="#6e849a" />}
          onChangeInput={onChangeBorderRadiusInput}
          onChangeSlider={onChangeOpacitySlider}
        />
      </Section>
    </>
  );
};

export default RectangleEditor;
