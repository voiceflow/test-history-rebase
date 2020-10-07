import composeRefs from '@seznam/compose-react-refs';
import React from 'react';

import { isMac, isSafari } from '@/config';
import { OverlayValue, withOverlay } from '@/contexts';
import { Identifier } from '@/styles/constants';
import { ANIMATION_SPEED } from '@/styles/theme';
import { Pair, Point, Viewport } from '@/types';
import { mouseEventOffset } from '@/utils/dom';
import { CartesianPlane, Coords, Vector } from '@/utils/geometry';

import { Container, RenderLayer } from './components';
import {
  CANVAS_ANIMATING_CLASSNAME,
  CANVAS_BUSY_CLASSNAME,
  CANVAS_INTERACTING_CLASSNAME,
  CANVAS_SHIFT_PRESSED_CLASSNAME,
  ControlScheme,
  ControlType,
  ZOOM_FACTOR,
} from './constants';
import { CanvasProvider } from './contexts';
import generateControls, { ControlHandlers } from './controls';
import { ControlAction, ZoomAction } from './controls/types';
import { calculateScrollTranslation, normalizeZoom, transformStyle } from './controls/utils';
import { MovementCalculator, StyleOptions, TransformOptions, TransitionOptions, ZoomOptions } from './types';

export const ORIGIN: Point = [0, 0];

export type CanvasAPI = Canvas['api'];

export type CanvasProps = {
  viewport?: Viewport;
  controlScheme?: ControlScheme;
  innerRef?: React.Ref<HTMLDivElement>;
  className?: string;
  onChange?: (viewport: Viewport) => void;
  addClass?: (className: string) => void;
  removeClass?: (className: string) => void;
  onPan?: (movement: Pair<number>) => void;
  onZoom?: (translateZoom: MovementCalculator) => void;
  onClick?: (event: React.MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onMouseDown?: (event: React.MouseEvent) => void;
  onRightClick?: (event: React.MouseEvent) => void;
  onSelectDragStart?: (event: React.DragEvent) => void;
  onRegister?: (api: CanvasAPI | null) => void;
  onDragStart?: (event: React.DragEvent) => void;
};

class Canvas extends React.PureComponent<WithRequired<CanvasProps, 'controlScheme'> & { overlay: OverlayValue }> {
  static defaultProps = {
    controlScheme: isMac ? ControlScheme.TRACKPAD : ControlScheme.MOUSE,
  };

  rootRef = React.createRef<HTMLDivElement>();

  renderLayerRef = React.createRef<HTMLDivElement>();

  zoom = this.props.viewport ? this.props.viewport.zoom : ZOOM_FACTOR;

  position: Point = this.props.viewport ? [this.props.viewport.x, this.props.viewport.y] : ORIGIN;

  controlTeardownHandlers: (() => void)[] = [];

  applyTransitionTimeout: number | null = null;

  rect: DOMRect | null = null;

  api = {
    getControlScheme: () => this.controls.scheme,
    isPanning: () => this.controls.isPanning,
    isTrackpadPanning: () => this.controls?.isTrackpadPanning,
    getZoom: () => this.zoom / ZOOM_FACTOR,
    getPosition: () => this.position,
    getRef: () => this.rootRef.current!,
    getRect: () => this.rootRef.current!.getBoundingClientRect(),
    getCachedRect: () => {
      if (this.rect !== null) return this.rect;

      const rect = this.rootRef.current!.getBoundingClientRect();

      this.rect = rect;

      return rect;
    },
    getOuterPlane: (): CartesianPlane => {
      const { x, y } = this.api.getCachedRect();

      return {
        origin: new Coords([x, y]),
        scale: 1,
      };
    },
    getPlane: (): CartesianPlane => {
      const [posX, posY] = this.position;
      const { x, y } = this.api.getCachedRect();

      return {
        origin: new Coords([x + posX, y + posY]),
        scale: this.api.getZoom(),
      };
    },
    fromCoords(coords: Vector) {
      return coords.map(this.getPlane());
    },
    toCoords(point: Point) {
      return new Coords(point, this.getPlane());
    },
    toVector(point: Point) {
      return new Vector(point, this.getPlane());
    },
    getBoundingPosition: () => {
      const { x, y } = this.renderLayerRef.current!.getBoundingClientRect();
      return [x, y];
    },

    zoomIn: (delta: number, options?: ZoomOptions) => this.offsetZoom(delta, options),
    zoomOut: (delta: number, options?: ZoomOptions) => this.offsetZoom(-delta, options),
    reorient: () => this.resetPosition(),

    setZoom: (zoom: number, options?: ZoomOptions) => this.setZoom(zoom, options),

    setPosition: (position: Point, options?: StyleOptions) => {
      this.position = position;
      this.onChange();
      this.styleRenderLayer(options);
    },

    applyStyles: (styles: React.CSSProperties) => this.applyStyles(styles),

    applyTransition: (options?: TransitionOptions) => this.applyTransition(options),

    transformPoint(point: Point, { relative, bounding }: TransformOptions = {}): Point {
      const [posX, posY] = bounding ? this.getBoundingPosition() : this.getPosition();
      const zoom = this.getZoom();
      const [x, y] = relative ? point : this.mapPoint(point);

      return [(x - posX) / zoom, (y - posY) / zoom];
    },

    mapPoint([x, y]: Point): Point {
      const rect = this.getRect();

      return [x - rect.left, y - rect.top];
    },

    reverseTransformPoint(point: Point, relative?: boolean): Point {
      const [posX, posY] = this.getPosition();
      const zoom = this.getZoom();
      const [x, y] = relative ? point : this.reverseMapPoint(point);

      return [x * zoom + posX, y * zoom + posY];
    },

    reverseMapPoint([x, y]: Point): Point {
      const rect = this.getRect();

      return [x + rect.left, y + rect.top];
    },

    setBusy: (isBusy: boolean) => {
      if (isBusy) {
        this.addClass(CANVAS_BUSY_CLASSNAME);
      } else {
        this.removeClass(CANVAS_BUSY_CLASSNAME);
      }
    },
  };

  addClass = (className: string) => this.rootRef.current?.classList.add(className);

  removeClass = (className: string) => this.rootRef.current?.classList.remove(className);

  onChange = () =>
    this.props.onChange?.({
      x: this.position[0],
      y: this.position[1],
      zoom: this.zoom,
    });

  onPan = (offsetX: number, offsetY: number) => {
    const [posX, posY] = this.position;
    const nextPosition: Point = [posX + offsetX, posY + offsetY];
    this.position = nextPosition;

    this.onTransitionEnd();

    this.styleRenderLayer({ position: nextPosition });

    this.props.onPan?.([offsetX, offsetY]);
  };

  onZoom = (control: ZoomAction) => {
    // scale or delta type zoom
    if (control.scale) {
      this.setZoom(this.zoom * control.scale, { origin: mouseEventOffset(control.event, this.rootRef.current!) });
    } else if (control.delta) {
      this.setZoom(this.zoom + control.delta, { origin: mouseEventOffset(control.event, this.rootRef.current!) });
    }
  };

  onTransitionEnd = () => {
    if (this.applyTransitionTimeout === null) {
      return;
    }

    const renderLayerEl = this.renderLayerRef.current;

    clearTimeout(this.applyTransitionTimeout);

    this.props.removeClass?.(CANVAS_ANIMATING_CLASSNAME);
    this.applyTransitionTimeout = null;

    // sometimes in the test tool can be undefined
    if (renderLayerEl) {
      renderLayerEl.style.transition = '';
    }
  };

  applyStyles = (styles: React.CSSProperties) => {
    const renderLayerEl = this.renderLayerRef.current!;

    window.requestAnimationFrame(() => {
      Object.assign(renderLayerEl.style, styles);
    });
  };

  applyTransition = ({ delay = 0, duration = ANIMATION_SPEED }: TransitionOptions = {}) => {
    const renderLayerEl = this.renderLayerRef.current!;

    if (this.applyTransitionTimeout) {
      clearTimeout(this.applyTransitionTimeout);
    }

    this.props.addClass?.(CANVAS_ANIMATING_CLASSNAME);
    this.applyTransitionTimeout = setTimeout(this.onTransitionEnd, (duration + delay) * 1000 + 100);

    renderLayerEl.style.transition = `transform ease-in-out ${duration}s ${delay}s`;
  };

  styleRenderLayer({ zoom = this.zoom, position = this.position }: StyleOptions = {}) {
    const renderLayerEl = this.renderLayerRef.current!;

    window.requestAnimationFrame(() => {
      renderLayerEl.style.transform = transformStyle(position, zoom);
    });
  }

  getScrollTranslation = ([originX, originY]: Point, prevZoom: number, nextZoom: number, zoomDiffFactor: number) =>
    calculateScrollTranslation([originX, originY], prevZoom, nextZoom, this.position, this.rootRef.current!.getBoundingClientRect(), zoomDiffFactor);

  serialize = () => ({
    zoom: this.zoom,
    x: this.position[0],
    y: this.position[1],
  });

  offsetZoom = (delta: number, options?: ZoomOptions) => this.setZoom(this.zoom + delta, options);

  setZoom = (newZoom: number, { origin = [this.rootRef.current!.clientWidth / 2, this.rootRef.current!.clientHeight / 2] }: ZoomOptions = {}) => {
    const prevZoom = this.zoom / ZOOM_FACTOR;
    const nextZoom = normalizeZoom(newZoom);
    const zoomDiffFactor = newZoom / this.zoom;

    if (nextZoom === this.zoom) return;

    this.zoom = nextZoom;

    const [x, y] = this.position;
    const [moveX, moveY] = this.getScrollTranslation(origin, prevZoom, nextZoom, zoomDiffFactor);
    const nextPosition: Point = [x + moveX, y + moveY];
    this.position = nextPosition;

    this.styleRenderLayer({ zoom: nextZoom, position: nextPosition });

    this.props.onZoom?.((position) =>
      calculateScrollTranslation(origin, prevZoom, nextZoom, position, this.rootRef.current!.getBoundingClientRect(), zoomDiffFactor)
    );
  };

  resetPosition = () => {
    this.position = ORIGIN;

    this.styleRenderLayer({ position: ORIGIN });
  };

  handleControl = (control: ControlAction) => {
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
        this.props.onClick?.(control.event);
        break;
      case ControlType.MOUSE_UP:
        this.props.onMouseUp?.(control.event);
        break;
      case ControlType.START_INTERACTION:
        this.props.addClass?.(CANVAS_INTERACTING_CLASSNAME);
        break;
      case ControlType.END_INTERACTION:
        this.props.removeClass?.(CANVAS_INTERACTING_CLASSNAME);
        break;
      case ControlType.END:
        this.onChange();
        break;
      case ControlType.SELECT_DRAG_START:
        this.props.onSelectDragStart?.(control.event);
        break;
      default:
    }
  };

  controls = generateControls(this.props.controlScheme, this.handleControl);

  onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.controls.click(event);
  };

  onMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { onMouseDown } = this.props;

    onMouseDown?.(event);
    this.controls.mousedown(event);
  };

  onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    const { onDragStart } = this.props;

    onDragStart?.(event);
    this.controls.dragstart(event);
  };

  onKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Shift') {
      this.props.removeClass?.(CANVAS_SHIFT_PRESSED_CLASSNAME);
    }
  };

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Shift') {
      this.props.addClass?.(CANVAS_SHIFT_PRESSED_CLASSNAME);
    }
  };

  componentDidMount() {
    this.props.onRegister?.(this.api);

    const bindControl = (type: keyof ControlHandlers) => (e: any) => this.controls[type](e);
    const addListener = (type: keyof ControlHandlers, options?: AddEventListenerOptions) => {
      const handler = bindControl(type);
      this.rootRef.current?.addEventListener(type, handler, options);

      this.controlTeardownHandlers.push(() => this.rootRef.current?.removeEventListener(type, handler));
    };

    addListener('wheel', { passive: false });

    if (isSafari) {
      addListener('gesturestart');
      addListener('gesturechange');
    }

    this.rootRef.current?.addEventListener('keyup', this.onKeyUp);
    this.rootRef.current?.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    this.props.onRegister?.(null);

    this.controlTeardownHandlers.forEach((teardownHandler) => teardownHandler());

    this.rootRef.current?.removeEventListener('keyup', this.onKeyUp);
    this.rootRef.current?.removeEventListener('keydown', this.onKeyDown);
  }

  componentDidUpdate(prevProps: CanvasProps) {
    if (prevProps.controlScheme !== this.props.controlScheme) {
      this.controls = generateControls(this.props.controlScheme, this.handleControl);
    }
  }

  render() {
    const { onRightClick, innerRef, children, className } = this.props;

    return (
      <CanvasProvider value={this.api}>
        <Container
          draggable
          id={Identifier.CANVAS}
          className={className}
          onContextMenu={onRightClick}
          onClick={this.onClick}
          onDragStart={this.onDragStart}
          onMouseDown={this.onMouseDown}
          tabIndex={-1}
          ref={innerRef ? composeRefs(this.rootRef, innerRef) : this.rootRef}
        >
          <RenderLayer ref={this.renderLayerRef} style={{ transform: transformStyle(this.position, this.zoom) }}>
            {children}
          </RenderLayer>
        </Container>
      </CanvasProvider>
    );
  }
}

export default withOverlay(Canvas) as React.FC<CanvasProps>;
