import { DEVICE_SIZE_MAP, DeviceType } from '@voiceflow/general-types';
import { StepData, VisualType } from '@voiceflow/general-types/build/nodes/visual';
import React from 'react';

import { ZOOM_FACTOR } from '@/components/Canvas/constants';
import { PlatformType } from '@/constants';
import { useTheme } from '@/hooks';
import { ALL_DEVICES } from '@/pages/Prototype/constants';
import { Pair } from '@/types';
import { isAnyGeneralPlatform } from '@/utils/typeGuards';

const DEFAULT_FILL_RATIO = 0.8;
const DEFAULT_FRAME_DIMENSION = 400;

type Dimension = {
  width: number;
  height: number;
};

export const useDeviceDimension = ({ data, device }: { data: StepData | null; device: DeviceType | null }): Dimension =>
  React.useMemo(() => {
    if (data?.visualType === VisualType.IMAGE) {
      return data.device
        ? DEVICE_SIZE_MAP[data.device]
        : {
            width: data.dimensions?.width ?? DEFAULT_FRAME_DIMENSION,
            height: data.dimensions?.height ?? DEFAULT_FRAME_DIMENSION,
          };
    }

    const deviceInfo = ALL_DEVICES.find(({ type }) => type === device);

    return {
      width: deviceInfo?.dimension.width ?? DEFAULT_FRAME_DIMENSION,
      height: deviceInfo?.dimension.height ?? DEFAULT_FRAME_DIMENSION,
    };
  }, [device, data]);

export const useInitialCanvas = ({ platform, dimension }: { platform: PlatformType; dimension: Dimension }) => {
  const theme = useTheme();

  return React.useMemo(() => {
    const bodyWidth = document.body.clientWidth;
    const isGeneral = isAnyGeneralPlatform(platform);
    const usedWidth = isGeneral ? theme.components.usedGeneralPrototypeDisplayCanvasWidth : theme.components.usedPrototypeDisplayCanvasWidth;
    const canvasWidth = bodyWidth - usedWidth;
    const canvasHeight = document.body.clientHeight - theme.components.usedPrototypeDisplayCanvasHeight;

    const frameWidth = dimension.width;
    const frameHeight = dimension.height;

    const scaleX = Math.min((canvasWidth * DEFAULT_FILL_RATIO) / frameWidth, 2);
    const scaleY = Math.min((canvasHeight * DEFAULT_FILL_RATIO) / frameHeight, 2);
    const scale = Math.min(scaleX, scaleY);

    const settingsWidth = isGeneral ? 0 : theme.components.displaySettings.width;
    const offsetXOffset = theme.components.prototypeSidebar.width - (theme.components.subMenu.width + settingsWidth);
    const offsetX = (Math.abs(bodyWidth - frameWidth * scale) - offsetXOffset) / 2;
    const offsetY = Math.abs(canvasHeight - frameHeight * scale) / 2;

    return {
      zoom: scale * ZOOM_FACTOR,
      offset: [offsetX, offsetY] as Pair<number>,
      dimensions: [frameWidth, frameHeight] as Pair<number>,
      canvasWidth,
    };
  }, [dimension.width, dimension.height]);
};
