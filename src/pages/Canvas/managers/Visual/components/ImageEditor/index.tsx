import { DEVICE_SIZE_MAP } from '@voiceflow/general-types';
import { ImageStepData } from '@voiceflow/general-types/build/nodes/visual';
import React from 'react';

import Box from '@/components/Box';
import Flex from '@/components/Flex';
import Input from '@/components/Input';
import RadioGroup from '@/components/RadioGroup';
import Section from '@/components/Section';
import Select, { defaultLabelRenderer } from '@/components/Select';
import Text, { BlockText, Link } from '@/components/Text';
import FullImage from '@/components/Upload/ImageUpload/FullImage';
import { DEVICE_LABEL_MAP } from '@/constants';
import { Content, Controls, FormControl } from '@/pages/Canvas/components/Editor';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { CANVAS_VISIBILITY_OPTIONS, DEVICE_OPTIONS, FRAME_OPTIONS, FrameType } from './constants';

const AnyFullImage = FullImage as any;

const DEFAULT_DIMENSIONS = { width: 500, height: 500 };

const ImageEditor: NodeEditor<ImageStepData> = ({ data, onChange }) => {
  const [dimensions, setDimensions] = React.useState<null | { width: string; height: string }>(() =>
    data.dimensions ? { width: String(data.dimensions.width), height: String(data.dimensions.height) } : null
  );
  const frameType = data.dimensions ? FrameType.CUSTOM_SIZE : FrameType.DEVICE;

  const onChangeFrameType = (newFrameType: FrameType) => {
    if (newFrameType === FrameType.CUSTOM_SIZE) {
      setDimensions({ width: `${DEFAULT_DIMENSIONS.width}`, height: `${DEFAULT_DIMENSIONS.height}` });
      onChange({ device: null, dimensions: DEFAULT_DIMENSIONS });
    } else {
      setDimensions(null);
      onChange({ device: null, dimensions: null });
    }
  };

  const onChangeDimensions = (dimension: 'width' | 'height') => ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
    if (!currentTarget.value || currentTarget.value.match(/^\d+$/)) {
      setDimensions((prevDimensions) => ({ ...prevDimensions!, [dimension]: currentTarget.value }));
    }
  };

  const onBlurDimensions = () => {
    onChange({
      dimensions: {
        width: Number(dimensions?.width ?? '0') || data.dimensions?.width || DEFAULT_DIMENSIONS.width,
        height: Number(dimensions?.height ?? '0') || data.dimensions?.height || DEFAULT_DIMENSIONS.height,
      },
    });
  };

  return (
    <Content
      footer={() => (
        <Controls>
          <Link href="https://docs.voiceflow.com/#/platform/steps/response-steps/response?id=visuals-step">How it Works</Link>
        </Controls>
      )}
    >
      <Section dividers isDividerNested isDividerBottom>
        <FormControl label="Frame Type" contentBottomUnits={0}>
          <RadioGroup isFlat options={FRAME_OPTIONS} checked={frameType} onChange={onChangeFrameType} />
        </FormControl>
      </Section>

      <Section dividers={!!data.image} isDividerNested isDividerBottom>
        {frameType === FrameType.CUSTOM_SIZE ? (
          <FormControl label="Dimensions">
            <Flex>
              <Box width="104px" mr={12}>
                <Input
                  value={dimensions?.width}
                  onBlur={onBlurDimensions}
                  onChange={onChangeDimensions('width')}
                  placeholder="500"
                  rightAction={
                    <Text fontSize={13} color="#62778c" fontWeight="bold">
                      W
                    </Text>
                  }
                />
              </Box>
              <Box width="104px">
                <Input
                  value={dimensions?.height}
                  onBlur={onBlurDimensions}
                  onChange={onChangeDimensions('height')}
                  placeholder="500"
                  rightAction={
                    <Text fontSize={13} color="#62778c" fontWeight="bold">
                      H
                    </Text>
                  }
                />
              </Box>
            </Flex>
          </FormControl>
        ) : (
          <FormControl label="Device Type">
            <Select
              value={data.device}
              options={DEVICE_OPTIONS}
              onSelect={(value) => onChange({ device: value })}
              searchable
              placeholder="Select option"
              getOptionLabel={(value) => value && DEVICE_LABEL_MAP[value]}
              renderOptionLabel={(value, ...args) => (
                <Box display="flex" justifyContent="space-between" alignItems="center" flex="1">
                  {defaultLabelRenderer(value, ...args)}

                  <Text fontSize={13} color="#62778c">
                    {DEVICE_SIZE_MAP[value].width} x {DEVICE_SIZE_MAP[value].height}
                  </Text>
                </Box>
              )}
            />
          </FormControl>
        )}

        <FormControl
          label={
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" flex="1">
              <span>Image</span>

              {(data.device || dimensions) && (
                <Text fontSize={13} color="#62778c" fontWeight="normal">
                  {data.device ? (
                    <>
                      {DEVICE_SIZE_MAP[data.device].width} x {DEVICE_SIZE_MAP[data.device].height}
                    </>
                  ) : (
                    <>
                      {dimensions?.width} x {dimensions?.height}
                    </>
                  )}
                </Text>
              )}
            </Box>
          }
          contentBottomUnits={0}
        >
          <AnyFullImage update={(url?: string) => onChange({ image: url ?? null })} image={data.image} canUseLink={false} />

          {!data.image && (
            <BlockText fontSize={13} color="#62778c" mt={16}>
              Images uploaded to visual steps will appear on the visual tab when testing your project and within shareable prototypes.
            </BlockText>
          )}
        </FormControl>
      </Section>

      {!!data.image && (
        <Section dividers={false}>
          <FormControl label="Canvas Visibility" contentBottomUnits={0}>
            <RadioGroup
              isFlat
              options={CANVAS_VISIBILITY_OPTIONS}
              checked={data.canvasVisibility}
              onChange={(value) => onChange({ canvasVisibility: value })}
            />
          </FormControl>
        </Section>
      )}
    </Content>
  );
};

export default ImageEditor;
