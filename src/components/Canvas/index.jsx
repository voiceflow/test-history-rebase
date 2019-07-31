import mouseEventOffset from 'mouse-event-offset';
import React from 'react';

import { stopPropagation } from '@/utils/dom';

import { Container, RenderLayer } from './components';
import { CanvasProvider } from './contexts';

export const ORIGIN = [0, 0];

export const ZOOM_FACTOR = 100;
export const MIN_ZOOM = 10;
export const MAX_ZOOM = 200;

export const SCROLL_FACTOR = 60;
export const PINCH_SCROLL_FACTOR = 3;

export const MAX_CLICK_TRAVEL = 3;

function transformStyle([posX, posY], zoom) {
  return `translate(${posX}px, ${posY}px) scale(${zoom / ZOOM_FACTOR})`;
}

function getScrollDelta(event) {
  const scrollDelta = event.deltaY;

  // check if it is pinch gesture
  if (event.ctrlKey && scrollDelta % 1 !== 0) {
    return scrollDelta / PINCH_SCROLL_FACTOR;
  }

  return scrollDelta / SCROLL_FACTOR;
}

function normalizeZoom(zoom) {
  return Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);
}

class Canvas extends React.PureComponent {
  rootRef = React.createRef();

  renderLayerRef = React.createRef();

  zoom = ZOOM_FACTOR;

  position = ORIGIN;

  offset = this.props.offset || ORIGIN;

  isPanning = false;

  panDistance = 0;

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
    const [canvasX, canvasY] = this.position;
    const { width: canvasWidth, height: canvasHeight } = this.rootRef.current.getBoundingClientRect();

    const zoomDelta = nextZoom / ZOOM_FACTOR - prevZoom;

    // compute width and height increment factor
    const xFactor = (originX - canvasX) / prevZoom / canvasWidth;
    const yFactor = (originY - canvasY) / prevZoom / canvasHeight;

    // compute difference between rect before and after scroll
    const deltaX = canvasWidth * zoomDelta * xFactor;
    const deltaY = canvasHeight * zoomDelta * yFactor;

    return [canvasX - deltaX, canvasY - deltaY];
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

    const canvasAPI = {
      getZoom: () => this.zoom / ZOOM_FACTOR,
      getPosition: () => this.position,
      zoomIn: (delta) => this.offsetZoom(delta),
      zoomOut: (delta) => this.offsetZoom(-delta),
      reorient: () => this.resetPosition(),
    };

    return (
      <CanvasProvider value={canvasAPI}>
        <Container ref={this.rootRef} onWheel={this.onScroll} onMouseDown={this.onMouseDown}>
          <RenderLayer ref={this.renderLayerRef}>{children}</RenderLayer>
        </Container>
      </CanvasProvider>
    );
  }
}

export default Canvas;
