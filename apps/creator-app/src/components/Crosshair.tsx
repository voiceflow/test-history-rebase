import { Portal } from '@voiceflow/ui';
import _constant from 'lodash/constant';
import React from 'react';

import { CANVAS_CROSSHAIR_ENABLED } from '@/config';
import { styled } from '@/hocs/styled';
import { EngineContext } from '@/pages/Canvas/contexts';
import { useCanvasMouse } from '@/pages/Canvas/hooks/canvas';
import { CartesianPlane, Coords } from '@/utils/geometry';

interface ReticuleProps {
  color?: string;
}

const Reticule = styled.div<ReticuleProps>`
  position: absolute;
  border-radius: 50%;
  border: 1px solid ${({ color = 'blue' }) => color};
  transform: translate(-50%, -50%);
  height: 20px;
  width: 20px;
  pointer-events: none;
  color: ${({ color = 'blue' }) => color};
  z-index: 11;

  span {
    white-space: nowrap;
    padding-left: 20px;
    padding-top: 20px;
  }
`;

export type CrosshairProps = ReticuleProps & {
  portal?: boolean;
  onCanvas?: boolean;
  withCoords?: boolean;
  plane?: CartesianPlane;
};

/**
 * this component is intended for testing only
 */
const Crosshair: React.FC<CrosshairProps> = CANVAS_CROSSHAIR_ENABLED
  ? ({ plane, portal, onCanvas, color, withCoords }) => {
      const ref = React.useRef<HTMLDivElement>(null);
      const engine = React.useContext(EngineContext);

      useCanvasMouse(
        (point) => {
          const renderPlane = plane || (onCanvas && engine?.canvas?.getPlane()) || Coords.WINDOW_PLANE;
          const [x, y] = point.map(renderPlane);
          const el = ref.current!;

          window.requestAnimationFrame(() => {
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;

            if (withCoords) {
              el.children[0].innerHTML = `[${x.toFixed(2)}, ${y.toFixed(2)}]`;
            }
          });
        },
        [plane]
      );

      const reticule = (
        <Reticule color={color} ref={ref}>
          <span />
        </Reticule>
      );

      return portal ? <Portal>{reticule}</Portal> : reticule;
    }
  : _constant(null);

export default Crosshair;
