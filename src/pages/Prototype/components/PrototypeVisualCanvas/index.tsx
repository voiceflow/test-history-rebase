import React from 'react';
import { useTheme } from 'styled-components';

import Canvas from '@/components/Canvas';
import { ZOOM_FACTOR } from '@/components/Canvas/constants';
import BaseRenderer, { BaseRendererAPI } from '@/components/DisplayRenderer/components/BaseRenderer';
import * as Creator from '@/ducks/creator';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useDidUpdateEffect, useLinkedState } from '@/hooks';
import { NodeData } from '@/models';
import { DEVICE_LIST, DeviceType } from '@/pages/Prototype/constants';
import * as SideEffects from '@/store/sideEffects';
import { Theme } from '@/styles/theme';
import { ConnectedProps, MergeArguments } from '@/types';

import { Container, Frame, FrameTitle, PlaceHolder } from './components';

const DEFAULT_FILL_RATIO = 0.8;
const DEFAULT_FRAME_DIMENSION = 400;

const PrototypeVisualCanvas: React.FC<ConnectedPrototypeVisualCanvasProps> = ({ device, platform, sourceData, controlScheme, resolveAPL }) => {
  const [aplContext, setAPLContext] = React.useState<{ apl: string; data: string; commands: string } | null>(null);
  const rendererRef = React.useRef<BaseRendererAPI | null>(null);
  const deviceInfo = DEVICE_LIST[platform][device as DeviceType];
  const theme = useTheme() as Theme;

  React.useEffect(() => {
    if (sourceData) {
      resolveAPL(sourceData).then(setAPLContext);
    } else {
      setAPLContext(null);
    }
  }, [sourceData]);

  const { zoom: initialZoom, offset, dimensions } = React.useMemo(() => {
    const bodyWidth = document.body.clientWidth;
    const canvasWidth = bodyWidth - theme.components.usedPrototypeDisplayCanvasWidth;
    const canvasHeight = document.body.clientHeight - theme.components.usedPrototypeDisplayCanvasHeight;

    const frameWidth = deviceInfo?.dimension.width ?? DEFAULT_FRAME_DIMENSION;
    const frameHeight = deviceInfo?.dimension.height ?? DEFAULT_FRAME_DIMENSION;

    const scale = (canvasWidth * DEFAULT_FILL_RATIO) / frameWidth;

    const offsetXOffset = theme.components.prototypeSidebar.width - (theme.components.subMenu.width + theme.components.displaySettings.width);
    const offsetX = (Math.abs(bodyWidth - frameWidth * scale) - offsetXOffset) / 2;
    const offsetY = Math.abs(canvasHeight - frameHeight * scale) / 2;

    return {
      zoom: scale * ZOOM_FACTOR,
      offset: [offsetX, offsetY],
      dimensions: [frameWidth, frameHeight],
    };
  }, [deviceInfo?.dimension]);

  const renderKey = React.useMemo(() => Math.random(), [aplContext, deviceInfo?.dimension]);

  const isRound = device === DeviceType.ECHO_SPOT;

  useDidUpdateEffect(() => {
    rendererRef.current?.renderPreview();
  }, [renderKey]);

  const [zoom, setZoom] = useLinkedState(initialZoom);

  const showPreview = !!aplContext;

  return (
    <Container>
      <Canvas
        controlScheme={controlScheme}
        viewport={{ zoom, x: offset[0], y: offset[1] }}
        onChange={(viewport) => setZoom(viewport.zoom)}
        scrollTimeout={100}
        key={renderKey}
      >
        <div style={{ position: 'relative' }}>
          {showPreview && (
            <FrameTitle>
              {deviceInfo?.name}
              <span>{zoom.toFixed(0)}% zoom</span>
            </FrameTitle>
          )}
          <Frame isRound={isRound}>
            {showPreview ? (
              <BaseRenderer
                overrideDevice={{ width: dimensions[0], height: dimensions[1], density: deviceInfo!.dimension.density }}
                isRound={isRound}
                apl={aplContext!.apl}
                data={aplContext!.data}
                commands={aplContext!.commands}
                scale={1}
                onFail={console.error}
                ref={rendererRef}
                key={renderKey}
              />
            ) : (
              <PlaceHolder width={dimensions[0]} height={dimensions[1]} />
            )}
          </Frame>
        </div>
      </Canvas>
    </Container>
  );
};

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
  controlScheme: UI.canvasNavigationSelector,
  device: Prototype.prototypeVisualDeviceSelector,
  sourceID: Prototype.prototypeVisualSourceIDSelector,
  sourceData: Creator.dataByNodeIDSelector,
};

const mapDispatchToProps = {
  resolveAPL: SideEffects.resolveAPL,
};

const mergeProps = (...[{ sourceID, sourceData: getDataByNodeID }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps>) => ({
  sourceData: sourceID ? (getDataByNodeID(sourceID) as NodeData<NodeData.Display>) : null,
});

type ConnectedPrototypeVisualCanvasProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(PrototypeVisualCanvas as any) as React.FC;
