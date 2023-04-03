import { BaseNode } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { ZOOM_FACTOR } from '@/components/Canvas/constants';
import { useTheme } from '@/hooks';
import { ALL_DEVICES } from '@/pages/Prototype/constants';
import { Pair } from '@/types';

const DEFAULT_FILL_RATIO = 0.8;
const DEFAULT_FRAME_DIMENSION = 400;

interface Dimension {
  width: number;
  height: number;
}

export const useDeviceDimension = ({
  data,
  device,
}: {
  data: BaseNode.Visual.StepData | null;
  device: BaseNode.Visual.DeviceType | null;
}): Dimension =>
  React.useMemo(() => {
    if (data?.visualType === BaseNode.Visual.VisualType.IMAGE) {
      return data.device
        ? VoiceflowConstants.DEVICE_SIZE_MAP[data.device]
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

export const useInitialCanvas = ({ platform, dimension }: { platform: Platform.Constants.PlatformType; dimension: Dimension }) => {
  const theme = useTheme();

  return React.useMemo(() => {
    const platformConfig = Platform.Config.get(platform);

    const bodyWidth = document.body.clientWidth;
    const usedWidth = platformConfig.isVoiceflowBased
      ? theme.components.usedGeneralPrototypeDisplayCanvasWidth
      : theme.components.usedPrototypeDisplayCanvasWidth;

    const canvasWidth = bodyWidth - usedWidth;
    const canvasHeight = document.body.clientHeight - theme.components.usedPrototypeDisplayCanvasHeight;

    const frameWidth = dimension.width;
    const frameHeight = dimension.height;

    const scaleX = Math.min((canvasWidth * DEFAULT_FILL_RATIO) / frameWidth, 2);
    const scaleY = Math.min((canvasHeight * DEFAULT_FILL_RATIO) / frameHeight, 2);
    const scale = Math.min(scaleX, scaleY);

    const settingsWidth = platformConfig.isVoiceflowBased ? 0 : theme.components.displaySettings.width;
    const offsetXOffset = theme.components.prototypeSidebar.width - (theme.components.sidebarIconMenu.width + settingsWidth);
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
