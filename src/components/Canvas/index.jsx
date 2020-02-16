import composeRefs from '@seznam/compose-react-refs';
import mouseEventOffset from 'mouse-event-offset';
import React from 'react';

import { isMac, isSafari } from '@/config';
import { withOverlay } from '@/contexts';
import { ANIMATION_SPEED } from '@/styles/theme';

import { Container, RenderLayer } from './components';
import { ControlScheme, ControlType, ZOOM_FACTOR } from './constants';
import { CanvasProvider } from './contexts';
import generateControls from './controls';
import { calculateScrollTranslation, normalizeZoom, transformStyle } from './controls/utils';

export const ORIGIN = [0, 0];

class Canvas extends React.PureComponent {
  rootRef = React.createRef();

  renderLayerRef = React.createRef();

  zoom = this.props.viewport ? this.props.viewport.zoom : ZOOM_FACTOR;

  position = this.props.viewport ? [this.props.viewport.x, this.props.viewport.y] : ORIGIN;

  controlTeardownHandlers = [];

  api = {
    getControlScheme: () => this.controls.scheme,
    isPanning: () => this.controls.isPanning,
    isTrackpadPanning: () => this.controls?.isTrackpadPanning,
    getZoom: () => this.zoom / ZOOM_FACTOR,
    getPosition: () => this.position,
    getRef: () => this.rootRef.current,
    getRect: () => this.rootRef.current.getBoundingClientRect(),
    zoomIn: (delta, options) => this.offsetZoom(delta, { animated: true, ...options }),
    zoomOut: (delta, options) => this.offsetZoom(-delta, { animated: true, ...options }),
    reorient: () => this.resetPosition(),

    setZoom: (zoom, options) => this.setZoom(zoom, options),

    setPosition: (position, options) => {
      this.position = position;
      this.styleRenderLayer(options);
    },

    applyStyles: (styles) => this.applyStyles(styles),

    applyTransition: (options) => this.applyTransition(options),

    transformPoint(point, relative) {
      const [posX, posY] = this.getPosition();
      const zoom = this.getZoom();
      const [x, y] = relative ? point : this.mapPoint(point);

      return [(x - posX) / zoom, (y - posY) / zoom];
    },

    mapPoint([x, y]) {
      const rect = this.getRect();

      return [x - rect.left, y - rect.top];
    },

    reverseTransformPoint(point, relative) {
      const [posX, posY] = this.getPosition();
      const zoom = this.getZoom();
      const [x, y] = relative ? point : this.reverseMapPoint(point);

      return [x * zoom + posX, y * zoom + posY];
    },

    reverseMapPoint([x, y]) {
      const rect = this.getRect();

      return [x + rect.left, y + rect.top];
    },
  };

  onChange = () =>
    this.props.onChange &&
    this.props.onChange({
      x: this.position[0],
      y: this.position[1],
      zoom: this.zoom,
    });

  onPan = (offsetX, offsetY) => {
    const [posX, posY] = this.position;
    const nextPosition = [posX + offsetX, posY + offsetY];
    this.position = nextPosition;

    this.onTransitionEnd();

    this.styleRenderLayer({ position: nextPosition });

    if (this.props.onPan) {
      this.props.onPan(offsetX, offsetY);
    }
  };

  onZoom = (control) => {
    // scale or delta type zoom
    if (control.scale) {
      this.setZoom(this.zoom * control.scale, { animated: false, origin: mouseEventOffset(control.event, this.rootRef.current) });
    } else if (control.delta) {
      this.setZoom(this.zoom + control.delta, { animated: false, origin: mouseEventOffset(control.event, this.rootRef.current) });
    }
  };

  onTransitionEnd = () => {
    if (this.applyTransitionTimeout === null) {
      return;
    }

    const renderLayerEl = this.renderLayerRef.current;

    clearTimeout(this.applyTransitionTimeout);

    this.applyTransitionTimeout = null;

    renderLayerEl.style.willChange = '';
    renderLayerEl.style.transition = '';
  };

  applyStyles = (styles) => {
    const renderLayerEl = this.renderLayerRef.current;

    // eslint-disable-next-line compat/compat
    window.requestAnimationFrame(() => {
      Object.keys(styles).forEach((style) => {
        renderLayerEl.style[style] = styles[style];
      });
    });
  };

  applyTransition = ({ delay = 0, duration = ANIMATION_SPEED } = {}) => {
    const renderLayerEl = this.renderLayerRef.current;

    clearTimeout(this.applyTransitionTimeout);
    this.applyTransitionTimeout = setTimeout(this.onTransitionEnd, (duration + delay) * 1000 + 100);

    renderLayerEl.style.willChange = 'transform';
    renderLayerEl.style.transition = `transform ease-in-out ${duration}s ${delay}s`;
  };

  styleRenderLayer({ zoom = this.zoom, position = this.position } = {}) {
    const renderLayerEl = this.renderLayerRef.current;

    // eslint-disable-next-line compat/compat
    window.requestAnimationFrame(() => {
      renderLayerEl.style.transform = transformStyle(position, zoom);
    });
  }

  getScrollTranslation = ([originX, originY], prevZoom, nextZoom) =>
    calculateScrollTranslation([originX, originY], prevZoom, nextZoom, this.position, this.rootRef.current.getBoundingClientRect());

  serialize = () => ({
    zoom: this.zoom,
    x: this.position[0],
    y: this.position[1],
  });

  offsetZoom = (delta, options) => this.setZoom(this.zoom + delta, options);

  setZoom = (newZoom, { origin = [this.rootRef.current.clientWidth / 2, this.rootRef.current.clientHeight / 2] } = {}) => {
    const prevZoom = this.zoom / ZOOM_FACTOR;
    const nextZoom = normalizeZoom(newZoom);
    if (nextZoom === this.zoom) return;
    this.zoom = nextZoom;

    const [x, y] = this.position;
    const [moveX, moveY] = this.getScrollTranslation(origin, prevZoom, nextZoom);
    const nextPosition = [x + moveX, y + moveY];
    this.position = nextPosition;

    this.styleRenderLayer({ zoom: nextZoom, position: nextPosition });

    if (this.props.onZoom) {
      this.props.onZoom((position) => calculateScrollTranslation(origin, prevZoom, nextZoom, position, this.rootRef.current.getBoundingClientRect()));
    }
  };

  resetPosition = () => {
    this.position = ORIGIN;

    this.styleRenderLayer({ position: ORIGIN });
  };

  handleControl = (control = {}) => {
    if (!control.type) return;

    switch (control.type) {
      case ControlType.PAN:
        this.props.overlay.dismiss();
        this.onPan(control.deltaX, control.deltaY);
        break;
      case ControlType.SCALE:
        this.props.overlay.dismiss();
        this.onZoom(control);
        break;
      case ControlType.CLICK:
        this.props.overlay.dismiss();
        this.props.onClick && this.props.onClick();
        break;
      case ControlType.END:
        this.onChange();
        break;
      case ControlType.SHIFT_MOUSEDOWN:
        this.props.onShiftClick && this.props.onShiftClick(control.event);
        break;
      default:
    }
  };

  controls = generateControls(this.props.controlScheme, this.handleControl);

  componentDidMount() {
    if (this.props.onRegister) {
      this.props.onRegister(this.api);
    }

    const bindControl = (type) => (e) => this.controls[type](e);
    const addListener = (type, options) => {
      const handler = bindControl(type);
      this.rootRef.current.addEventListener(type, handler, options);

      this.controlTeardownHandlers.push(() => this.rootRef.current.removeEventListener(type, handler));
    };

    addListener('wheel', { passive: false });

    if (isSafari) {
      addListener('gesturestart');
      addListener('gesturechange');
    }
  }

  componentWillUnmount() {
    if (this.props.onRegister) {
      this.props.onRegister(null);
    }

    this.controlTeardownHandlers.forEach((teardownHandler) => teardownHandler());
  }

  componentDidUpdate(prevProps) {
    if (prevProps.controlScheme !== this.props.controlScheme) {
      this.controls = generateControls(this.props.controlScheme, this.handleControl);
    }
  }

  render() {
    const { onRightClick, innerRef, children, disableClick } = this.props;

    return (
      <CanvasProvider value={this.api}>
        <Container
          onContextMenu={onRightClick}
          onMouseDown={disableClick ? undefined : this.controls.mousedown}
          tabIndex={-1}
          ref={composeRefs(this.rootRef, innerRef)}
        >
          <RenderLayer ref={this.renderLayerRef} style={{ transform: transformStyle(this.position, this.zoom) }}>
            {children}
          </RenderLayer>
        </Container>
      </CanvasProvider>
    );
  }
}

Canvas.defaultProps = {
  controlScheme: isMac ? ControlScheme.TRACKPAD : ControlScheme.MOUSE,
};

export default withOverlay(Canvas);
