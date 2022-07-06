import { BaseNode } from '@voiceflow/base-types';
import { Nullable, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, defaultMenuLabelRenderer, Flex, Input, Link, Select, Text, Upload } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Section from '@/components/Section';
import VariablesInput from '@/components/VariablesInput';
import * as Documentation from '@/config/documentation';
import { DEVICE_LABEL_MAP, NUMBERS_ONLY_REGEXP } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks';
import { Content, Controls, FormControl } from '@/pages/Canvas/components/Editor';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { CANVAS_VISIBILITY_OPTIONS, DEVICE_OPTIONS, FRAME_OPTIONS } from './constants';

const DEFAULT_DIMENSIONS = { width: 500, height: 500 };

const ImageEditor: NodeEditor<BaseNode.Visual.ImageStepData, Realtime.NodeData.VisualBuiltInPorts> = ({ data, onChange }) => {
  const [dimensions, setDimensions] = React.useState<null | { width: string; height: string }>(() =>
    data.dimensions ? { width: String(data.dimensions.width), height: String(data.dimensions.height) } : null
  );
  const cache = React.useRef({ preDimensions: data.dimensions, prevDevice: data.device });
  const persistedFrameType = Object.values(BaseNode.Visual.FrameType).includes(data.frameType as BaseNode.Visual.FrameType)
    ? (data.frameType as BaseNode.Visual.FrameType)
    : BaseNode.Visual.FrameType.AUTO;
  const [frameType, setFrameType] = React.useState(persistedFrameType);

  const platform = useSelector(ProjectV2.active.platformSelector);

  const setAutoFit = (frame: BaseNode.Visual.FrameType, url: Nullable<string> | string | undefined) => {
    const currentImage = new Image();
    if (frame === BaseNode.Visual.FrameType.AUTO) {
      currentImage.src = String(url);
      currentImage.onload = (e: any) => {
        const { height } = e.path[0];
        const { width } = e.path[0];
        setDimensions({ width: `${width}`, height: `${height}` });
        onChange({ device: null, dimensions: { width, height }, frameType: frame });
      };
    }
  };

  const onChangeFrameType = (newFrameType: BaseNode.Visual.FrameType) => {
    if (newFrameType === BaseNode.Visual.FrameType.CUSTOM_SIZE) {
      cache.current.prevDevice = data.device;
      const newDimensions = cache.current.preDimensions ?? DEFAULT_DIMENSIONS;
      setDimensions({ width: `${newDimensions.width}`, height: `${newDimensions.height}` });
      onChange({ device: null, dimensions: newDimensions, frameType: BaseNode.Visual.FrameType.CUSTOM_SIZE });

      setFrameType(newFrameType);
    } else if (newFrameType === BaseNode.Visual.FrameType.DEVICE) {
      setDimensions(null);
      onChange({ device: cache.current.prevDevice, dimensions: null, frameType: BaseNode.Visual.FrameType.DEVICE });
      setFrameType(newFrameType);
    } else {
      setFrameType(newFrameType);
      setAutoFit(newFrameType, data.image);
    }
  };

  const onChangeDimensions = (dimension: 'width' | 'height') => (value: string) => {
    if (!value || value.match(NUMBERS_ONLY_REGEXP)) {
      setDimensions((prevDimensions) => ({ ...prevDimensions!, [dimension]: value }));
    }
  };

  const onBlurDimensions = () => {
    const newDimensions = {
      width: Number(dimensions?.width ?? '0') || data.dimensions?.width || DEFAULT_DIMENSIONS.width,
      height: Number(dimensions?.height ?? '0') || data.dimensions?.height || DEFAULT_DIMENSIONS.height,
    };

    if (Utils.object.shallowEquals(data.dimensions, newDimensions)) return;

    onChange({ dimensions: newDimensions });
  };

  const visualSizeSection = (
    <Section dividers isDividerNested isDividerBottom>
      <FormControl label="Size" contentBottomUnits={0}>
        <RadioGroup isFlat options={FRAME_OPTIONS} checked={frameType} onChange={(e) => onChangeFrameType(e)} />
      </FormControl>
    </Section>
  );

  const renderVisualSizeSection = Realtime.Utils.platform.createPlatformSelector<React.ReactNode>(
    {
      [VoiceflowConstants.PlatformType.VOICEFLOW]: visualSizeSection,
    },
    () => null
  );

  const ratio = (Number(dimensions?.height) / Number(dimensions?.width)) * 100 || 0;

  const getImageDimensions = (frameType: BaseNode.Visual.FrameType) => {
    return frameType === BaseNode.Visual.FrameType.CUSTOM_SIZE ? `${dimensions?.width} x ${dimensions?.height}` : 'Display at full size';
  };
  return (
    <Content
      footer={() => (
        <Controls>
          <Link href={Documentation.VISUALS_STEP}>How it Works</Link>
        </Controls>
      )}
    >
      {renderVisualSizeSection(platform)}

      <Section dividers={!!data.image} isDividerNested isDividerBottom>
        {frameType === BaseNode.Visual.FrameType.CUSTOM_SIZE ? (
          <FormControl label="Dimensions">
            <Flex>
              <Box width="104px" mr={12}>
                <Input
                  value={dimensions?.width}
                  onBlur={onBlurDimensions}
                  onChangeText={onChangeDimensions('width')}
                  placeholder="500"
                  rightAction={
                    <Text fontSize={13} color="#62778c" fontWeight="600">
                      W
                    </Text>
                  }
                />
              </Box>
              <Box width="104px">
                <Input
                  value={dimensions?.height}
                  onBlur={onBlurDimensions}
                  onChangeText={onChangeDimensions('height')}
                  placeholder="500"
                  rightAction={
                    <Text fontSize={13} color="#62778c" fontWeight="600">
                      H
                    </Text>
                  }
                />
              </Box>
            </Flex>
          </FormControl>
        ) : (
          frameType === BaseNode.Visual.FrameType.DEVICE && (
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
                      {VoiceflowConstants.DEVICE_SIZE_MAP[value].width} x {VoiceflowConstants.DEVICE_SIZE_MAP[value].height}
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
                      {VoiceflowConstants.DEVICE_SIZE_MAP[data.device].width} x {VoiceflowConstants.DEVICE_SIZE_MAP[data.device].height}
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
          <Upload.FullImage
            image={data.image}
            ratio={ratio}
            canUseLink={false}
            renderInput={VariablesInput.renderInput}
            update={(url) => {
              onChange({ image: url ?? null });
              setAutoFit(frameType, url);
            }}
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
