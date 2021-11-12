import { Node } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Box, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Canvas from '@/components/Canvas';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Prototype from '@/ducks/prototype';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useLinkedState } from '@/hooks';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { APL, Image, PlaceholderIconContainer } from './components';
import { useDeviceDimension, useInitialCanvas } from './hooks';

interface PrototypeVisualCanvasProps {
  isShown: boolean;
}

const PrototypeVisualCanvas: React.FC<PrototypeVisualCanvasProps & ConnectedPrototypeVisualCanvasProps> = ({
  data,
  device,
  isShown,
  platform,
  controlScheme,
  zoomType,
}) => {
  const dimension = useDeviceDimension({ data, device });
  const { zoom: initialZoom, offset: initialOffset, dimensions, canvasWidth } = useInitialCanvas({ platform, dimension });

  const canvasKey = React.useMemo(() => Utils.id.cuid(), [dimension.width, dimension.height]);
  const contentKey = React.useMemo(() => Utils.id.cuid(), [device, data]);

  const [zoom, setZoom] = useLinkedState(initialZoom, canvasKey);
  const [offset, setOffset] = useLinkedState(initialOffset, canvasKey);

  const visualRenderProps = {
    zoom,
    device,
    platform,
    dimensions,
  };

  return !isShown ? null : (
    <Box height="100%" id={Identifier.DISPLAY_CANVAS_CONTAINER}>
      <Canvas
        key={canvasKey}
        viewport={{ zoom, x: offset[0], y: offset[1] }}
        onChange={(viewport) => {
          setZoom(viewport.zoom);
          setOffset([viewport.x, viewport.y]);
        }}
        scrollTimeout={100}
        controlScheme={controlScheme}
        getZoomType={() => zoomType}
      >
        {data?.visualType === Node.Visual.VisualType.IMAGE && <Image key={contentKey} {...visualRenderProps} data={data} />}
        {data?.visualType === Node.Visual.VisualType.APL && <APL key={contentKey} {...visualRenderProps} data={data} />}
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
  platform: ProjectV2.active.platformSelector,
  controlScheme: UI.canvasNavigationSelector,
  zoomType: UI.zoomTypeSelector,
};

type ConnectedPrototypeVisualCanvasProps = ConnectedProps<typeof mapStateToProps, {}>;

export default connect(mapStateToProps, null)(PrototypeVisualCanvas as any) as React.FC<PrototypeVisualCanvasProps>;
