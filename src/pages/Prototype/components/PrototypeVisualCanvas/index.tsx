import { DEVICE_SIZE_MAP } from '@voiceflow/general-types';
import { VisualType } from '@voiceflow/general-types/build/nodes/visual';
import cuid from 'cuid';
import React from 'react';
import { useTheme } from 'styled-components';

import Box from '@/components/Box';
import Canvas from '@/components/Canvas';
import { ZOOM_FACTOR } from '@/components/Canvas/constants';
import { PlatformType } from '@/constants';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useLinkedState } from '@/hooks';
import { DEVICE_LIST } from '@/pages/Prototype/constants';
import { Theme } from '@/styles/theme';
import { ConnectedProps, Pair } from '@/types';

import { APL, Image } from './components';

const DEFAULT_FILL_RATIO = 0.8;
const DEFAULT_FRAME_DIMENSION = 400;

const PrototypeVisualCanvas: React.FC<ConnectedPrototypeVisualCanvasProps> = ({ data, device, platform, controlScheme }) => {
  const theme = useTheme() as Theme;

  const dimension = React.useMemo(() => {
    if (data?.visualType === VisualType.IMAGE) {
      return data.device
        ? DEVICE_SIZE_MAP[data.device]
        : {
            width: data.dimensions?.width ?? DEFAULT_FRAME_DIMENSION,
            height: data.dimensions?.height ?? DEFAULT_FRAME_DIMENSION,
          };
    }

    const deviceInfo = DEVICE_LIST[platform].find(({ type }) => type === device);

    return {
      width: deviceInfo?.dimension.width ?? DEFAULT_FRAME_DIMENSION,
      height: deviceInfo?.dimension.height ?? DEFAULT_FRAME_DIMENSION,
    };
  }, [platform, device, data]);

  const { zoom: initialZoom, offset, dimensions } = React.useMemo(() => {
    const bodyWidth = document.body.clientWidth;
    const isGeneral = platform === PlatformType.GENERAL;
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
    };
  }, [dimension, data, platform]);

  const key = React.useMemo(() => cuid(), [data, device]);

  const [zoom, setZoom] = useLinkedState(initialZoom, key);

  const visualRenderProps = {
    zoom,
    device,
    platform,
    dimensions,
  };

  return (
    <Box height="100%">
      <Canvas
        key={key}
        viewport={{ zoom, x: offset[0], y: offset[1] }}
        onChange={(viewport) => setZoom(viewport.zoom)}
        scrollTimeout={100}
        controlScheme={controlScheme}
      >
        {data?.visualType === VisualType.IMAGE && <Image key={key} {...visualRenderProps} data={data} />}
        {data?.visualType === VisualType.APL && <APL key={key} {...visualRenderProps} data={data} />}
      </Canvas>
    </Box>
  );
};

const mapStateToProps = {
  data: Prototype.prototypeVisualDataSelector,
  device: Prototype.prototypeVisualDeviceSelector,
  platform: Skill.activePlatformSelector,
  controlScheme: UI.canvasNavigationSelector,
};

type ConnectedPrototypeVisualCanvasProps = ConnectedProps<typeof mapStateToProps, {}>;

export default connect(mapStateToProps, null)(PrototypeVisualCanvas as any) as React.FC;
