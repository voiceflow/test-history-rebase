import { DeviceType } from '@voiceflow/general-types';
import { VisualType } from '@voiceflow/general-types/build/nodes/visual';
import cuid from 'cuid';
import _throttle from 'lodash/throttle';
import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import * as Prototype from '@/ducks/prototype';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useCache, useDidUpdateEffect, useSetup } from '@/hooks';
import { useDeviceDimension } from '@/pages/Prototype/components/PrototypeVisualCanvas/hooks';
import { FadeContainer } from '@/styles/animations';
import { ConnectedProps } from '@/types';

import { APL, Container, Image, PlaceholderContainer, ScaleContainer } from './components';
import { getScale } from './utils';

type VisualsProps = {
  isMobile?: boolean;
  onMouseUp?: () => void;
  onMouseDown?: () => void;
  isFullScreen?: boolean;
};

const Visuals: React.FC<VisualsProps & ConnectedVisualsProps> = ({ data, device, isMobile, isFullScreen, onMouseUp, onMouseDown }) => {
  const dimension = useDeviceDimension({ data, device: device || DeviceType.ECHO_SHOW_10 });
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = React.useState(1);

  const cache = useCache({ dimension });

  const contentKey = React.useMemo(() => cuid(), [dimension.width, dimension.height]);

  const onContainerRef = React.useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
    setScale(getScale(node, cache.current.dimension));
  }, []);

  useSetup(() => {
    const onResize = _throttle(() => {
      setScale(getScale(containerRef.current, cache.current.dimension));
    }, 30);

    window.addEventListener('resize', onResize);

    onResize();

    return () => window.removeEventListener('resize', onResize);
  });

  useDidUpdateEffect(() => {
    setScale(getScale(containerRef.current, dimension));
  }, [dimension.width, dimension.height, isFullScreen]);

  return (
    <Container ref={onContainerRef} isMobile={isMobile} onMouseUp={onMouseUp} onMouseDown={onMouseDown}>
      {!!containerRef.current && (
        <>
          {data?.visualType === VisualType.IMAGE && (
            <FadeContainer key={contentKey}>
              <ScaleContainer width={dimension.width} height={dimension.height} scale={scale} isMobile={isMobile}>
                <Image url={data.image} width={dimension.width} height={dimension.height} />
              </ScaleContainer>
            </FadeContainer>
          )}
          {data?.visualType === VisualType.APL && (
            <FadeContainer key={contentKey}>
              <ScaleContainer width={dimension.width} height={dimension.height} scale={scale} isMobile={isMobile}>
                <APL data={data} device={device} dimension={dimension} />
              </ScaleContainer>
            </FadeContainer>
          )}
          {!data?.visualType && (
            <PlaceholderContainer>
              <SvgIcon icon="visualsPlaceholder" width={100} height={100} />
            </PlaceholderContainer>
          )}
        </>
      )}
    </Container>
  );
};

const mapStateToProps = {
  data: Prototype.prototypeVisualDataSelector,
  device: Prototype.prototypeVisualDeviceSelector,
  controlScheme: UI.canvasNavigationSelector,
};

type ConnectedVisualsProps = ConnectedProps<typeof mapStateToProps, {}>;

export default connect(mapStateToProps, null)(Visuals as any) as React.FC<VisualsProps>;
