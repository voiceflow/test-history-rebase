import mouseEventOffset from 'mouse-event-offset';
import React from 'react';

import { stopPropagation } from '@/utils/dom';

import { Container, RenderLayer } from './components';
import { ZOOM_FACTOR } from './constants';
import { CanvasProvider } from './contexts';
import { calculateScrollTranslation, getScrollDelta, normalizeZoom, transformStyle } from './utils';

export const ORIGIN = [0, 0];

export const MAX_CLICK_TRAVEL = 3;

class Canvas extends React.PureComponent {
  rootRef = React.createRef();

  renderLayerRef = React.createRef();

  zoom = ZOOM_FACTOR;

  position = ORIGIN;

  offset = this.props.offset || ORIGIN;

  isPanning = false;

  panDistance = 0;

  api = {
    getZoom: () => this.zoom / ZOOM_FACTOR,
    getPosition: () => this.position,
    zoomIn: (delta) => this.offsetZoom(delta),
    zoomOut: (delta) => this.offsetZoom(-delta),
    reorient: () => this.resetPosition(),
  };

  onScroll = stopPropagation((event) => {
    const scrollDelta = getScrollDelta(event);
    const scrollOrigin = mouseEventOffset(event, this.rootRef.current);

    this.offsetZoom(scrollDelta, scrollOrigin);
  });

  onPan = ({ movementX, movementY }) => {
    this.isPanning = true;

    const [posX, posY] = this.position;
    const nextPosition = [posX + movementX, posY + movementY];
    this.position = nextPosition;
    this.panDistance += Math.max(Math.abs(movementX), Math.abs(movementY));

    this.styleRenderLayer(nextPosition);
  };

  onMouseDown = stopPropagation(() => {
    document.addEventListener('mousemove', this.onPan);
    document.addEventListener('mouseup', this.onMouseUp);
  });

  onMouseUp = () => {
    if (this.isPanning) {
      this.isPanning = false;

      if (this.panDistance < MAX_CLICK_TRAVEL) {
        this.props.onClick();
      }

      this.panDistance = 0;
    } else {
      this.props.onClick();
    }

    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onPan);
  };

  styleRenderLayer([posX, posY] = this.position, zoom = this.zoom) {
    // eslint-disable-next-line compat/compat
    window.requestAnimationFrame(() => {
      this.renderLayerRef.current.style.transform = transformStyle([posX + this.offset[0], posY + this.offset[1]], zoom);
    });
  }

  getScrollTranslation([originX, originY], prevZoom, nextZoom) {
    return calculateScrollTranslation([originX, originY], prevZoom, nextZoom, this.position, this.rootRef.current.getBoundingClientRect());
  }

  serialize = () => ({
    zoom: this.zoom,
    x: this.position[0],
    y: this.position[1],
  });

  offsetZoom = (zoomOffset, origin = [this.rootRef.current.clientWidth / 2, this.rootRef.current.clientHeight / 2]) => {
    const prevZoom = this.zoom / ZOOM_FACTOR;
    const nextZoom = normalizeZoom(this.zoom + zoomOffset);
    if (nextZoom === this.zoom) {
      return;
    }
    this.zoom = nextZoom;

    const nextPosition = this.getScrollTranslation(origin, prevZoom, nextZoom);
    this.position = nextPosition;

    this.styleRenderLayer(nextPosition, nextZoom);
  };

  resetPosition = () => {
    this.position = ORIGIN;

    this.styleRenderLayer(ORIGIN);
  };

  componentDidMount() {
    this.styleRenderLayer();
  }

  render() {
    const { children } = this.props;

    return (
      <CanvasProvider value={this.api}>
        <Container ref={this.rootRef} onWheel={this.onScroll} onMouseDown={this.onMouseDown}>
          <RenderLayer ref={this.renderLayerRef}>{children}</RenderLayer>
        </Container>
      </CanvasProvider>
    );
  }
}

export default Canvas;
