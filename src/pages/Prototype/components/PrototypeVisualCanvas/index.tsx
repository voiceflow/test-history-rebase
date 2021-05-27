import { VisualType } from '@voiceflow/general-types/build/nodes/visual';
import cuid from 'cuid';
import React from 'react';

import Box from '@/components/Box';
import Canvas from '@/components/Canvas';
import SvgIcon from '@/components/SvgIcon';
import * as Project from '@/ducks/project';
import * as Prototype from '@/ducks/prototype';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useLinkedState } from '@/hooks';
import { ConnectedProps } from '@/types';

import { APL, Image, PlaceholderIconContainer } from './components';
import { useDeviceDimension, useInitialCanvas } from './hooks';

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
  const dimension = useDeviceDimension({ data, device });
  const { zoom: initialZoom, offset: initialOffset, dimensions, canvasWidth } = useInitialCanvas({ platform, dimension });

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
        <PlaceholderIconContainer platform={platform} width={canvasWidth}>
          <SvgIcon icon="visualsPlaceholder" width={100} height={100} />
        </PlaceholderIconContainer>
      )}
    </Box>
  );
};

const mapStateToProps = {
  data: Prototype.prototypeVisualDataSelector,
  device: Prototype.prototypeVisualDeviceSelector,
  platform: Project.activePlatformSelector,
  controlScheme: UI.canvasNavigationSelector,
};

type ConnectedPrototypeVisualCanvasProps = ConnectedProps<typeof mapStateToProps, {}>;

export default connect(mapStateToProps, null)(PrototypeVisualCanvas as any) as React.FC<PrototypeVisualCanvasProps>;
