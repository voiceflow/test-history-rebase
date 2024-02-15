import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Animations, preventDefault, SvgIcon, useCache, useDidUpdateEffect } from '@voiceflow/ui';
import cn from 'classnames';
import _throttle from 'lodash/throttle';
import React from 'react';

import * as Prototype from '@/ducks/prototype';
import { useSelector } from '@/hooks/redux';
import { useDeviceDimension } from '@/pages/Prototype/hooks/deviceDimensions';
import { ClassName } from '@/styles/constants';

import { APL, Container, Image, ListenerContainer, PlaceholderContainer, ScaleContainer } from './components';
import { getScale } from './utils';

interface VisualsProps {
  isMobile?: boolean;
  listening: boolean;
  isFullScreen?: boolean;
  onStopListening: () => void;
  onStartListening: () => void;
}

const Visuals: React.FC<VisualsProps> = ({ isMobile, isFullScreen, onStopListening, onStartListening, listening }) => {
  const data = useSelector(Prototype.prototypeVisualDataSelector);
  const device = useSelector(Prototype.prototypeVisualDeviceSelector);

  const dimension = useDeviceDimension({ data, device: device || BaseNode.Visual.DeviceType.ECHO_SHOW_10 });
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = React.useState(1);

  const cache = useCache({ dimension, onStopListening, onStartListening });

  const contentKey = React.useMemo(() => Utils.id.cuid(), [dimension.width, dimension.height]);

  const onContainerRef = React.useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
    setScale(getScale(node, cache.current.dimension));
  }, []);

  useDidUpdateEffect(() => {
    setScale(getScale(containerRef.current, dimension));
  }, [dimension.width, dimension.height, isFullScreen]);

  React.useEffect(() => {
    const onResize = _throttle(() => setScale(getScale(containerRef.current, cache.current.dimension)), 30);
    const onPreventDefaultedStopListening = preventDefault(() => cache.current.onStopListening());
    const onPreventDefaultedStartListening = preventDefault(() => cache.current.onStartListening());

    window.addEventListener('resize', onResize);

    if (isMobile) {
      containerRef.current?.addEventListener('touchend', onPreventDefaultedStopListening);
      containerRef.current?.addEventListener('touchstart', onPreventDefaultedStartListening);
    }

    return () => {
      window.removeEventListener('resize', onResize);

      if (isMobile) {
        containerRef.current?.removeEventListener('touchend', onPreventDefaultedStopListening);
        containerRef.current?.removeEventListener('touchstart', onPreventDefaultedStartListening);
      }
    };
  }, []);

  return (
    <Container ref={onContainerRef} isMobile={isMobile}>
      {isMobile && <ListenerContainer listening={listening} />}
      {!!containerRef.current && (
        <>
          {data?.visualType === BaseNode.Visual.VisualType.IMAGE && (
            <Animations.Fade className={cn(ClassName.VISUAL, ClassName.VISUAL_IMAGE)} key={contentKey}>
              <ScaleContainer
                className={ClassName.SCALE_CONTAINER}
                width={dimension.width}
                height={dimension.height}
                scale={scale}
                isMobile={isMobile}
              >
                <Image url={data.image} width={dimension.width} height={dimension.height} />
              </ScaleContainer>
            </Animations.Fade>
          )}
          {data?.visualType === BaseNode.Visual.VisualType.APL && (
            <Animations.Fade className={cn(ClassName.VISUAL, ClassName.VISUAL_APL)} key={contentKey}>
              <ScaleContainer
                className={ClassName.SCALE_CONTAINER}
                width={dimension.width}
                height={dimension.height}
                scale={scale}
                isMobile={isMobile}
              >
                <APL data={data} device={device} dimension={dimension} />
              </ScaleContainer>
            </Animations.Fade>
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

export default Visuals;
