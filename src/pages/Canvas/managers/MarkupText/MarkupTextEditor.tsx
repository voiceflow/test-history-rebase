import React from 'react';

import type { Color } from '@/components/ColorPicker';
import { FlexAround } from '@/components/Flex';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { connect } from '@/hocs';
import { useDebouncedCallback } from '@/hooks';
import { Content, FormControl } from '@/pages/Canvas/components/Editor';
import { ColorSelect, FormGroup, Section, SliderInputGroup } from '@/pages/Canvas/components/MarkupComponents';

import { Hyperlink, IconButton, IconButtonSeparator } from './components';
import { FONTS_LABELS, FONT_WEIGHTS_LABELS, FONT_WEIGHTS_PER_FONT_FAMILY, Font, FontWeight, TextAlign, UPDATE_DATA_TIMEOUT } from './constants';

const PartialSelect = Select as React.ComponentType<Partial<React.ComponentProps<typeof Select>>>;

type BlockData = {
  textAlign?: TextAlign;
};

type TextData = {
  color: Color;
  fontSize: number;
  isItalic?: boolean;
  hyperlink?: string;
  fontFamily: Font;
  fontWeight: FontWeight;
  isUnderlined?: boolean;
};

export type MarkupTextEditorProps = {
  textData: TextData;
  blockData: BlockData;
  onChangeTextData: (Data: TextData) => void;
  onChangeBlockData: (Data: BlockData) => void;
};

export const MarkupTextEditor: React.FC<MarkupTextEditorProps> = ({ textData, blockData, onChangeTextData, onChangeBlockData }) => {
  const [link, setLink] = React.useState(textData.hyperlink ?? '');
  const [color, setColor] = React.useState(textData.color);
  const [fontSize, setFontSize] = React.useState(`${textData.fontSize}`);
  const [inputOpacity, setInputOpacity] = React.useState(`${textData.color.a * 100}`);

  const onUpdateTextData = (data: Partial<TextData>) => onChangeTextData({ ...textData, ...data });
  const onUpdateBlockData = (data: Partial<BlockData>) => onChangeBlockData({ ...blockData, ...data });

  const onUpdateTextDataDebounced = useDebouncedCallback(UPDATE_DATA_TIMEOUT, (data: Partial<TextData>) => onUpdateTextData(data), [
    onUpdateTextData,
  ]);

  const onChangeFontFamily = (value: Font) => {
    onUpdateTextData({
      fontFamily: value,
      fontWeight: FONT_WEIGHTS_PER_FONT_FAMILY[value].includes(textData.fontWeight) ? textData.fontWeight : FONT_WEIGHTS_PER_FONT_FAMILY[value][0],
    });
  };

  const onBlurFontSize = () => {
    if (fontSize === '') {
      setFontSize(`${textData.fontSize}`);
    }
  };

  const onChangeFontSize = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (value === '') {
      setFontSize(value);
    } else if (value.match(/^\d+$/)) {
      setFontSize(value);
      onUpdateTextDataDebounced({ fontSize: +value });
    }
  };

  const onChangeLink = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setLink(value);
    onUpdateTextDataDebounced({ hyperlink: value });
  };

  const onChangeColor = (nextColor: Color) => {
    setColor(nextColor);
    setInputOpacity(`${nextColor.a * 100}`);
    onUpdateTextData({ color: nextColor });
  };

  const onChangeOpacitySlider = (value: number) => {
    const opacity = value / 100;

    setColor((prevColor) => ({ ...prevColor, a: opacity }));
    setInputOpacity(`${value}`);
    onUpdateTextDataDebounced({ color: { ...textData.color, a: opacity } });
  };

  const onChangeOpacityInput = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (value === '') {
      setColor((prevColor) => ({ ...prevColor, a: 0 }));
      setInputOpacity(value);
    } else if (value.match(/^\d+$/)) {
      const opacity = Math.min(+value / 100, 1);

      setColor((prevColor) => ({ ...prevColor, a: opacity }));
      setInputOpacity(`${opacity * 100}`);
      onUpdateTextDataDebounced({ color: { ...textData.color, a: opacity } });
    }
  };

  const onBlurOpacityInput = () => {
    if (inputOpacity === '') {
      setInputOpacity(`${color.a * 100}`);
    }
  };

  return (
    <Content>
      <Section>
        <FormControl>
          <PartialSelect
            value={textData.fontFamily}
            options={Object.values(Font)}
            onSelect={onChangeFontFamily}
            getOptionLabel={(value: Font) => FONTS_LABELS[value]}
          />
        </FormControl>

        <FormGroup
          leftColumn={
            <PartialSelect
              value={textData.fontWeight}
              options={FONT_WEIGHTS_PER_FONT_FAMILY[textData.fontFamily]}
              onSelect={(value: FontWeight) => onUpdateTextData({ fontWeight: value })}
              getOptionLabel={(value: FontWeight) => FONT_WEIGHTS_LABELS[value]}
            />
          }
          rightColumn={<Input value={fontSize} type="number" placeholder="16" onChange={onChangeFontSize} onBlur={onBlurFontSize} />}
        />
      </Section>

      <Section>
        <FlexAround>
          <IconButton
            icon="textAlignLeft"
            active={!blockData.textAlign || blockData.textAlign === TextAlign.LEFT}
            onClick={() => onUpdateBlockData({ textAlign: TextAlign.LEFT })}
          />
          <IconButton
            icon="textAlignCenter"
            active={blockData.textAlign === TextAlign.CENTER}
            onClick={() => onUpdateBlockData({ textAlign: TextAlign.CENTER })}
          />
          <IconButton
            icon="textAlignRight"
            active={blockData.textAlign === TextAlign.RIGHT}
            onClick={() => onUpdateBlockData({ textAlign: TextAlign.RIGHT })}
          />

          <IconButtonSeparator />

          <IconButton icon="italic" active={textData.isItalic} onClick={() => onUpdateTextData({ isItalic: !textData.isItalic })} />
          <IconButton icon="underline" active={textData.isUnderlined} onClick={() => onUpdateTextData({ isUnderlined: !textData.isUnderlined })} />

          <IconButtonSeparator />

          <Hyperlink link={link} onChange={onChangeLink} />
        </FlexAround>
      </Section>

      <Section>
        <SliderInputGroup
          inputValue={inputOpacity}
          inputProps={{ placeholder: '100', onBlur: onBlurOpacityInput }}
          sliderValue={+inputOpacity}
          inputAction="%"
          sliderProps={{ min: 0 }}
          sliderPrefix={<ColorSelect color={color} onChange={onChangeColor} />}
          onChangeInput={onChangeOpacityInput}
          onChangeSlider={onChangeOpacitySlider}
        />
      </Section>
    </Content>
  );
};

const mapStateToProps = {};
const mapDispatchToProps = {};

// TODO: connect with the node
export default connect(mapStateToProps, mapDispatchToProps)(MarkupTextEditor);
