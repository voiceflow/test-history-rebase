import { Nullable } from '@voiceflow/api-sdk';
import { DEVICE_SIZE_MAP } from '@voiceflow/general-types';
import { FrameType, ImageStepData } from '@voiceflow/general-types/build/nodes/visual';
import { Box, defaultMenuLabelRenderer, Flex, Input, Link, Select, Text } from '@voiceflow/ui';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Section from '@/components/Section';
import FullImage from '@/components/Upload/ImageUpload/FullImage';
import * as Documentation from '@/config/documentation';
import { DEVICE_LABEL_MAP } from '@/constants';
import { Content, Controls, FormControl } from '@/pages/Canvas/components/Editor';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { CANVAS_VISIBILITY_OPTIONS, DEVICE_OPTIONS, FRAME_OPTIONS } from './constants';

const AnyFullImage = FullImage as any;

const DEFAULT_DIMENSIONS = { width: 500, height: 500 };

const ImageEditor: NodeEditor<ImageStepData> = ({ data, onChange }) => {
  const [dimensions, setDimensions] = React.useState<null | { width: string; height: string }>(() =>
    data.dimensions ? { width: String(data.dimensions.width), height: String(data.dimensions.height) } : null
  );
  const cache = React.useRef({ preDimensions: data.dimensions, prevDevice: data.device });
  const [frameType, setFrameType] = React.useState(FrameType.AUTO);

  const setAutoFit = (frame: FrameType, url: Nullable<string> | string | undefined) => {
    const currentImage = new Image();
    if (frame === FrameType.AUTO) {
      currentImage.src = String(url);
      currentImage.onload = (e: any) => {
        const { height } = e.path[0];
        const { width } = e.path[0];
        setDimensions({ width: `${width}`, height: `${height}` });
        onChange({ device: null, dimensions: { width, height }, frameType: frame });
      };
    }
  };

  const onChangeFrameType = (newFrameType: FrameType) => {
    if (newFrameType === FrameType.CUSTOM_SIZE) {
      cache.current.prevDevice = data.device;
      const newDimensions = cache.current.preDimensions ?? DEFAULT_DIMENSIONS;
      setDimensions({ width: `${newDimensions.width}`, height: `${newDimensions.height}` });
      onChange({ device: null, dimensions: newDimensions, frameType: FrameType.CUSTOM_SIZE });

      setFrameType(newFrameType);
    } else if (newFrameType === FrameType.DEVICE) {
      setDimensions(null);
      onChange({ device: cache.current.prevDevice, dimensions: null, frameType: FrameType.DEVICE });
      setFrameType(newFrameType);
    } else {
      setFrameType(newFrameType);
      setAutoFit(newFrameType, data.image);
    }
  };

  const onChangeDimensions =
    (dimension: 'width' | 'height') =>
    ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
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

  const ratio = (Number(dimensions?.height) / Number(dimensions?.width)) * 100 || 0;

  const getImageDimensions = (frameType: FrameType) => {
    return frameType === FrameType.CUSTOM_SIZE ? `${dimensions?.width} x ${dimensions?.height}` : 'Display at full size';
  };
  return (
    <Content
      footer={() => (
        <Controls>
          <Link href={Documentation.VISUALS_STEP}>How it Works</Link>
        </Controls>
      )}
    >
      <Section dividers isDividerNested isDividerBottom>
        <FormControl label="Size" contentBottomUnits={0}>
          <RadioGroup
            isFlat
            options={FRAME_OPTIONS}
            checked={frameType}
            onChange={(e) => {
              onChangeFrameType(e);
            }}
          />
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
          frameType === FrameType.DEVICE && (
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
                    {defaultMenuLabelRenderer(value, ...args)}

                    <Text fontSize={13} color="#62778c">
                      {DEVICE_SIZE_MAP[value].width} x {DEVICE_SIZE_MAP[value].height}
                    </Text>
                  </Box>
                )}
              />
            </FormControl>
          )
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
                    <>{getImageDimensions(frameType)}</>
                  )}
                </Text>
              )}
            </Box>
          }
          contentBottomUnits={0}
        >
          <AnyFullImage
            update={(url?: string) => {
              onChange({ image: url ?? null });
              setAutoFit(frameType, url);
            }}
            image={data.image}
            canUseLink={false}
            ratio={ratio}
          />
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
