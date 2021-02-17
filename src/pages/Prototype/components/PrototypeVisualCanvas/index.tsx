import { DEVICE_SIZE_MAP } from '@voiceflow/general-types';
import { VisualType } from '@voiceflow/general-types/build/nodes/visual';
import cuid from 'cuid';
import React from 'react';

import Box from '@/components/Box';
import Canvas from '@/components/Canvas';
import { ZOOM_FACTOR } from '@/components/Canvas/constants';
import SvgIcon from '@/components/SvgIcon';
import { PlatformType } from '@/constants';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useLinkedState, useTheme } from '@/hooks';
import { DEVICE_LIST } from '@/pages/Prototype/constants';
import { ConnectedProps, Pair } from '@/types';

import { APL, Image, PlaceholderIconContainer } from './components';

const DEFAULT_FILL_RATIO = 0.8;
const DEFAULT_FRAME_DIMENSION = 400;

type PrototypeVisualCanvasProps = {
  isShown: boolean;
};

const PrototypeVisualCanvas: React.FC<PrototypeVisualCanvasProps & ConnectedPrototypeVisualCanvasProps> = ({
  data,
  device,
  isShown,
  platform,
  controlScheme,
}) => {
  const theme = useTheme();

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

  const { zoom: initialZoom, offset: initialOffset, dimensions, canvasWidth } = React.useMemo(() => {
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
      canvasWidth,
    };
  }, [dimension.width, dimension.height]);

  const canvasKey = React.useMemo(() => cuid(), [dimension.width, dimension.height]);
  const contentKey = React.useMemo(() => cuid(), [device, data]);

  const [zoom, setZoom] = useLinkedState(initialZoom, canvasKey);
  const [offset, setOffset] = useLinkedState(initialOffset, canvasKey);

  const visualRenderProps = {
    zoom,
    device,
    platform,
    dimensions,
  };

  return !isShown ? null : (
    <Box height="100%">
      <Canvas
        key={canvasKey}
        viewport={{ zoom, x: offset[0], y: offset[1] }}
        onChange={(viewport) => {
          setZoom(viewport.zoom);
          setOffset([viewport.x, viewport.y]);
        }}
        scrollTimeout={100}
        controlScheme={controlScheme}
      >
        {data?.visualType === VisualType.IMAGE && <Image key={contentKey} {...visualRenderProps} data={data} />}
        {data?.visualType === VisualType.APL && <APL key={contentKey} {...visualRenderProps} data={data} />}
      </Canvas>

      {!data?.visualType && (
        <PlaceholderIconContainer width={canvasWidth}>
          <SvgIcon icon="visualsPlaceholder" width={100} height={100} />
        </PlaceholderIconContainer>
      )}
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

export default connect(mapStateToProps, null)(PrototypeVisualCanvas as any) as React.FC<PrototypeVisualCanvasProps>;
