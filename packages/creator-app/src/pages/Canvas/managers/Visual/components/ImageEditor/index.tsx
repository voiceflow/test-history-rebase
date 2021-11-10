import { Node } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import { Box, defaultMenuLabelRenderer, Flex, Input, Link, Select, Text } from '@voiceflow/ui';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Section from '@/components/Section';
import FullImage from '@/components/Upload/ImageUpload/FullImage';
import * as Documentation from '@/config/documentation';
import { DEVICE_LABEL_MAP, NUMBERS_ONLY_REGEXP } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks';
import { Content, Controls, FormControl } from '@/pages/Canvas/components/Editor';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import { createPlatformSelector } from '@/utils/platform';

import { CANVAS_VISIBILITY_OPTIONS, DEVICE_OPTIONS, FRAME_OPTIONS } from './constants';

const AnyFullImage = FullImage as any;

const DEFAULT_DIMENSIONS = { width: 500, height: 500 };

const ImageEditor: NodeEditor<Node.Visual.ImageStepData> = ({ data, onChange }) => {
  const [dimensions, setDimensions] = React.useState<null | { width: string; height: string }>(() =>
    data.dimensions ? { width: String(data.dimensions.width), height: String(data.dimensions.height) } : null
  );
  const cache = React.useRef({ preDimensions: data.dimensions, prevDevice: data.device });
  const [frameType, setFrameType] = React.useState(Node.Visual.FrameType.AUTO);

  const platform = useSelector(ProjectV2.active.platformSelector);

  const setAutoFit = (frame: Node.Visual.FrameType, url: Nullable<string> | string | undefined) => {
    const currentImage = new Image();
    if (frame === Node.Visual.FrameType.AUTO) {
      currentImage.src = String(url);
      currentImage.onload = (e: any) => {
        const { height } = e.path[0];
        const { width } = e.path[0];
        setDimensions({ width: `${width}`, height: `${height}` });
        onChange({ device: null, dimensions: { width, height }, frameType: frame });
      };
    }
  };

  const onChangeFrameType = (newFrameType: Node.Visual.FrameType) => {
    if (newFrameType === Node.Visual.FrameType.CUSTOM_SIZE) {
      cache.current.prevDevice = data.device;
      const newDimensions = cache.current.preDimensions ?? DEFAULT_DIMENSIONS;
      setDimensions({ width: `${newDimensions.width}`, height: `${newDimensions.height}` });
      onChange({ device: null, dimensions: newDimensions, frameType: Node.Visual.FrameType.CUSTOM_SIZE });

      setFrameType(newFrameType);
    } else if (newFrameType === Node.Visual.FrameType.DEVICE) {
      setDimensions(null);
      onChange({ device: cache.current.prevDevice, dimensions: null, frameType: Node.Visual.FrameType.DEVICE });
      setFrameType(newFrameType);
    } else {
      setFrameType(newFrameType);
      setAutoFit(newFrameType, data.image);
    }
  };

  const onChangeDimensions =
    (dimension: 'width' | 'height') =>
    ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
      if (!currentTarget.value || currentTarget.value.match(NUMBERS_ONLY_REGEXP)) {
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

  const renderVisualSizeSection = createPlatformSelector<() => React.ReactNode>(
    {
      [Constants.PlatformType.GENERAL]: () => (
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
      ),
    },
    () => null
  );

  const ratio = (Number(dimensions?.height) / Number(dimensions?.width)) * 100 || 0;

  const getImageDimensions = (frameType: Node.Visual.FrameType) => {
    return frameType === Node.Visual.FrameType.CUSTOM_SIZE ? `${dimensions?.width} x ${dimensions?.height}` : 'Display at full size';
  };
  return (
    <Content
      footer={() => (
        <Controls>
          <Link href={Documentation.VISUALS_STEP}>How it Works</Link>
        </Controls>
      )}
    >
      {renderVisualSizeSection(platform)()}

      <Section dividers={!!data.image} isDividerNested isDividerBottom>
        {frameType === Node.Visual.FrameType.CUSTOM_SIZE ? (
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
          frameType === Node.Visual.FrameType.DEVICE && (
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
                      {Constants.DEVICE_SIZE_MAP[value].width} x {Constants.DEVICE_SIZE_MAP[value].height}
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
                      {Constants.DEVICE_SIZE_MAP[data.device].width} x {Constants.DEVICE_SIZE_MAP[data.device].height}
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
