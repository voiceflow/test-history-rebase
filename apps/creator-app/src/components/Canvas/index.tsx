import composeRefs from '@seznam/compose-react-refs';
import type { WithRequired } from '@voiceflow/common';
import { IS_SAFARI, withContext } from '@voiceflow/ui';
import React from 'react';
import { DismissableLayerContext } from 'react-dismissable-layers';

import { CANVAS_COLOR } from '@/constants/canvas';
import { CANVAS_DRAGGING_CLASSNAME } from '@/pages/Canvas/constants';
import { Identifier } from '@/styles/constants';
import { ANIMATION_SPEED } from '@/styles/theme';
import type { Pair, Point, Viewport } from '@/types';
import { mouseEventOffset } from '@/utils/dom';
import type { CartesianPlane } from '@/utils/geometry';
import { Coords, Vector } from '@/utils/geometry';

import { Container, RenderLayer } from './components';
import type { ControlScheme } from './constants';
import {
  CANVAS_ANIMATING_CLASSNAME,
  CANVAS_BUSY_CLASSNAME,
  CANVAS_INTERACTING_CLASSNAME,
  CANVAS_SHIFT_PRESSED_CLASSNAME,
  ControlType,
  SCROLL_TIMEOUT,
  ZOOM_FACTOR,
  ZoomType,
} from './constants';
import { CanvasProvider } from './contexts';
import type { ControlHandlers } from './controls';
import generateControls from './controls';
import type { ControlAction, ZoomAction } from './controls/types';
import {
  backgroundPositionStyle,
  backgroundSizeStyle,
  calculateScrollTranslation,
  normalizeZoom,
  transformStyle,
} from './controls/utils';
import type { MovementCalculator, StyleOptions, TransformOptions, TransitionOptions, ZoomOptions } from './types';

export const ORIGIN: Point = [0, 0];

export const MAX_CANVAS_SIZE = 2 ** 16; // 65536
// voiceflow projects tend to span horizontally more than vertically
export const MIN_CANVAS_WIDTH = 2 ** 13; // 8192
export const MIN_CANVAS_HEIGHT = 2 ** 12; // 4096
export const BUFFER_REGION = 2 ** 11; // 2048

const ZOOM_FINISH_DURATION = 300;

const GRID_COLOR = '#dae2e2';

export type CanvasAPI = Canvas['api'];

export interface CanvasProps extends React.PropsWithChildren {
  viewport?: Viewport;
  controlScheme?: ControlScheme;
  innerRef?: React.Ref<HTMLDivElement>;
  scrollTimeout?: number;
  className?: string;
  layers?: React.ReactNode;
  onChange?: (viewport: Viewport) => void;
  addClass?: (className: string) => void;
  removeClass?: (className: string) => void;
  onPan?: (movement: Pair<number>) => void;
  onZoom?: (translateZoom: MovementCalculator) => void;
  onClick?: (event: React.MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onRightClick?: (event: React.MouseEvent) => void;
  onSelectDragStart?: (event: React.DragEvent) => void;
  onRegister?: (api: CanvasAPI | null) => void;
  onDragStart?: (event: React.DragEvent) => void;
  getZoomType: () => ZoomType;
  onPanApplied?: (movement: Pair<number>) => void;
  onZoomApplied?: (translateZoom: MovementCalculator) => void;
  canvasGridEnabled?: boolean;
}

class Canvas extends React.PureComponent<
  WithRequired<CanvasProps, 'controlScheme'> &
    React.PropsWithChildren<{ dismissableLayer: React.ContextType<typeof DismissableLayerContext> }>
> {
  static defaultProps: CanvasProps = {
    scrollTimeout: SCROLL_TIMEOUT,
    getZoomType: () => ZoomType.REGULAR,
  };

  private rect: DOMRect | null = null;

  private rootResizeObserver: ResizeObserver | null = null;

  rootRef = React.createRef<HTMLDivElement>();

  renderLayerRef = React.createRef<HTMLDivElement>();

  offsetLayerRef = React.createRef<HTMLDivElement>();

  zoom = this.props.viewport ? this.props.viewport.zoom : ZOOM_FACTOR;

  zoomComplete = 0;

  position: Point = this.props.viewport ? [this.props.viewport.x, this.props.viewport.y] : ORIGIN;

  controlTeardownHandlers: (() => void)[] = [];

  applyTransitionTimeout: NodeJS.Timeout | null = null;

  size = {
    width: MIN_CANVAS_WIDTH,
    height: MIN_CANVAS_HEIGHT,
    offsetX: MIN_CANVAS_WIDTH / 2,
    offsetY: MIN_CANVAS_HEIGHT / 2,
  };

  api = {
    setCanvasSize: (width: number, height: number, offsetX: number, offsetY: number) => {
      this.size = { width, height, offsetX, offsetY };
      this.forceUpdate();
    },
    getControlScheme: () => this.controls.scheme,
    applyControlScheme: (controlScheme: ControlScheme = this.props.controlScheme) => {
      this.controls = generateControls(controlScheme, this.handleControl, this.props.scrollTimeout);
    },
    isAnimating: () => !!this.applyTransitionTimeout,
    isPanning: () => this.controls.isPanning,
    getZoom: () => this.zoom / ZOOM_FACTOR,
    getPosition: () => this.position,
    getRef: () => this.rootRef.current,
    getRect: (): DOMRect => {
      if (this.rect !== null) return this.rect;
      if (!this.rootRef.current) return new DOMRect(0, 0, window.innerWidth, window.innerHeight);

      const rect = this.rootRef.current.getBoundingClientRect();

      this.rect = rect;

      return rect;
    },
    getOuterPlane: (): CartesianPlane => {
      const { x, y } = this.api.getRect();

      return {
        origin: new Coords([x, y]),
        scale: 1,
      };
    },
    getPlane: (): CartesianPlane => {
      const [posX, posY] = this.position;
      const { x, y } = this.api.getRect();

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
      const { x, y } =
        this.offsetLayerRef.current?.getBoundingClientRect() ??
        new DOMRect(0, 0, window.innerWidth, window.innerHeight);
      return [x, y];
    },

    zoomIn: (delta: number, options?: ZoomOptions) => {
      const inversed = this.props.getZoomType() === ZoomType.INVERSE;
      inversed ? this.offsetZoom(-delta, options) : this.offsetZoom(delta, options);
    },
    zoomOut: (delta: number, options?: ZoomOptions) => {
      const inversed = this.props.getZoomType() === ZoomType.INVERSE;

      inversed ? this.offsetZoom(delta, options) : this.offsetZoom(-delta, options);
    },
    reorient: () => this.resetPosition(),

    setZoom: (zoom: number, options?: ZoomOptions) => {
      this.setZoom(zoom, options);
    },

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

  onChange = () => this.props.onChange?.({ x: this.position[0], y: this.position[1], zoom: this.zoom });

  onPan = (offsetX: number, offsetY: number) => {
    const [posX, posY] = this.position;
    const nextPosition: Point = [posX + offsetX, posY + offsetY];
    const movement: Pair<number> = [offsetX, offsetY];

    this.position = nextPosition;

    this.onTransitionEnd();

    this.styleRenderLayer({ position: nextPosition, onApplied: () => this.props.onPanApplied?.(movement) });

    this.props.onPan?.(movement);
  };

  onZoom = (control: ZoomAction) => {
    if (!this.rootRef.current) return;

    const isInverse = this.props.getZoomType() === ZoomType.INVERSE;

    // scale or delta type zoom
    if (control.scale) {
      const scale = isInverse ? 2 - control.scale : control.scale;
      this.setZoom(this.zoom * scale, { origin: mouseEventOffset(control.event, this.rootRef.current) });
    } else if (control.delta) {
      const delta = isInverse ? control.delta : -control.delta;
      this.setZoom(this.zoom + delta, { origin: mouseEventOffset(control.event, this.rootRef.current) });
    }
  };

  onTransitionEnd = () => {
    if (this.applyTransitionTimeout === null) {
      return;
    }

    clearTimeout(this.applyTransitionTimeout);

    this.props.removeClass?.(CANVAS_ANIMATING_CLASSNAME);
    this.applyTransitionTimeout = null;

    const renderLayerEl = this.renderLayerRef.current;
    // sometimes in the test tool can be undefined
    if (renderLayerEl) {
      renderLayerEl.style.transition = '';
      this.styleCanvasGrid({});
    }
  };

  applyStyles = (styles: React.CSSProperties) => {
    window.requestAnimationFrame(() => {
      if (!this.renderLayerRef.current) return;

      Object.assign(this.renderLayerRef.current.style, styles);
    });
  };

  applyTransition = ({ delay = 0, duration = ANIMATION_SPEED }: TransitionOptions = {}) => {
    const renderLayerEl = this.renderLayerRef.current!;

    if (this.applyTransitionTimeout) {
      clearTimeout(this.applyTransitionTimeout);
    }
    this.props.addClass?.(CANVAS_ANIMATING_CLASSNAME);
    this.applyTransitionTimeout = setTimeout(this.onTransitionEnd, (duration + delay) * 1000 + 100);

    renderLayerEl.style.transition = `transform ease-in-out ${duration}s ${delay}s, backgroundImage ease-in-out ${duration}s ${delay}s, backgroundPosition ease-in-out ${duration}s ${delay}s`;
  };

  styleCanvasGrid({
    clear = false,
    zoom = this.zoom,
    position = this.position,
  }: {
    clear?: boolean;
    zoom?: number;
    position?: [number, number];
  }) {
    const gridLayerEl = this.rootRef.current;
    if (!gridLayerEl) return;

    if (this.props.canvasGridEnabled && !clear) {
      gridLayerEl.style.backgroundSize = backgroundSizeStyle(zoom);
      gridLayerEl.style.backgroundImage = `radial-gradient(${GRID_COLOR} ${zoom / 70}px, ${CANVAS_COLOR} ${zoom / 70}px)`;
      gridLayerEl.style.backgroundPosition = backgroundPositionStyle(position);
    } else {
      gridLayerEl.style.backgroundImage = 'none';
    }
  }

  styleRenderLayer({ raf = true, zoom = this.zoom, position = this.position, onApplied }: StyleOptions = {}) {
    this.styleCanvasGrid({ clear: false, zoom, position });

    const applyStyles = () => {
      const renderLayerEl = this.renderLayerRef.current;

      if (!renderLayerEl) return;

      renderLayerEl.style.transform = transformStyle(position, zoom, this.size.offsetX, this.size.offsetY);
      onApplied?.();
    };

    if (raf) {
      window.requestAnimationFrame(applyStyles);
    } else {
      applyStyles();
    }
  }

  getScrollTranslation = ([originX, originY]: Point, prevZoom: number, nextZoom: number, zoomDiffFactor: number) =>
    calculateScrollTranslation(
      [originX, originY],
      prevZoom,
      nextZoom,
      this.position,
      this.rootRef.current?.getBoundingClientRect() ?? new DOMRect(0, 0, window.innerWidth, window.innerHeight),
      zoomDiffFactor
    );

  serialize = () => ({
    zoom: this.zoom,
    x: this.position[0],
    y: this.position[1],
  });

  offsetZoom = (delta: number, options?: ZoomOptions) => {
    // clearGrid: true, clear the grid while a +/- hotkey zoom is in progress
    this.setZoom(this.zoom + delta, { ...options, clearGrid: true });
  };

  setZoom = (
    newZoom: number,
    {
      raf,
      clearGrid,
      origin = [
        (this.rootRef.current?.clientWidth ?? window.innerWidth) / 2,
        (this.rootRef.current?.clientHeight ?? window.innerHeight) / 2,
      ],
    }: ZoomOptions = {}
  ) => {
    const prevZoom = this.zoom / ZOOM_FACTOR;
    const nextZoom = normalizeZoom(newZoom);
    const zoomDiffFactor = nextZoom / this.zoom;

    if (nextZoom === this.zoom) return;
    this.zoom = nextZoom;

    const [x, y] = this.position;
    const [moveX, moveY] = this.getScrollTranslation(origin, prevZoom, nextZoom, zoomDiffFactor);
    const nextPosition: Point = [x + moveX, y + moveY];

    this.position = nextPosition;

    const calculateMovement = (position: Point) =>
      calculateScrollTranslation(
        origin,
        prevZoom,
        nextZoom,
        position,
        this.rootRef.current?.getBoundingClientRect() ?? new DOMRect(0, 0, window.innerWidth, window.innerHeight),
        zoomDiffFactor
      );

    this.styleRenderLayer({
      raf,
      zoom: nextZoom,
      position: nextPosition,
      onApplied: () => this.props.onZoomApplied?.(calculateMovement),
    });

    this.props.onZoom?.(calculateMovement);

    if (this.zoomComplete) {
      clearTimeout(this.zoomComplete);
    }

    if (clearGrid) {
      this.styleCanvasGrid({ clear: true });
    }
    this.zoomComplete = window.setTimeout(() => {
      this.onChange();
      this.styleCanvasGrid({});
    }, ZOOM_FINISH_DURATION);
  };

  resetPosition = () => {
    this.position = ORIGIN;

    this.styleRenderLayer({ position: ORIGIN });
  };

  handleControl = (control: ControlAction) => {
    if (!control.type) return;
    switch (control.type) {
      case ControlType.PAN:
        this.props.dismissableLayer.dismissAllGlobally();
        this.onPan(control.deltaX, control.deltaY);
        break;
      case ControlType.SCALE:
        this.props.dismissableLayer.dismissAllGlobally();
        this.onZoom(control);
        break;
      case ControlType.CLICK:
        this.props.onClick?.(control.event);
        break;
      case ControlType.START_PANNING:
        this.props.addClass?.(CANVAS_DRAGGING_CLASSNAME);
        break;
      case ControlType.STOP_PANNING:
        this.props.removeClass?.(CANVAS_DRAGGING_CLASSNAME);
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

  controls = generateControls(this.props.controlScheme, this.handleControl, this.props.scrollTimeout);

  onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.controls.click(event);
  };

  onMouseDown = (event: MouseEvent) => {
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
    this.controls.keyup(event);
  };

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Shift') {
      this.props.addClass?.(CANVAS_SHIFT_PRESSED_CLASSNAME);
    }
    this.controls.keydown(event);
  };

  componentDidMount() {
    this.props.onRegister?.(this.api);
    this.styleCanvasGrid({});
    const bindControl = (type: keyof ControlHandlers) => (e: any) => this.controls[type](e);
    const addListener = (type: keyof ControlHandlers, options?: AddEventListenerOptions) => {
      const handler = bindControl(type);
      this.rootRef.current?.addEventListener(type, handler, options);

      this.controlTeardownHandlers.push(() => this.rootRef.current?.removeEventListener(type, handler));
    };

    addListener('wheel', { passive: false });

    if (IS_SAFARI) {
      addListener('gesturestart');
      addListener('gesturechange');
    }

    this.rootResizeObserver = new ResizeObserver(() => {
      this.rect = null;
    });

    this.rootRef.current?.addEventListener('keyup', this.onKeyUp);
    this.rootRef.current?.addEventListener('keydown', this.onKeyDown);
    this.rootRef.current?.addEventListener('mousedown', this.onMouseDown);

    if (this.rootRef.current) {
      this.rootResizeObserver.observe(this.rootRef.current);
    }
  }

  componentWillUnmount() {
    this.props.onRegister?.(null);

    this.controlTeardownHandlers.forEach((teardownHandler) => teardownHandler());

    this.rootResizeObserver?.disconnect();
    this.rootRef.current?.removeEventListener('keyup', this.onKeyUp);
    this.rootRef.current?.removeEventListener('keydown', this.onKeyDown);
    this.rootRef.current?.removeEventListener('mousedown', this.onMouseDown);
  }

  componentDidUpdate(prevProps: CanvasProps) {
    if (prevProps.controlScheme !== this.props.controlScheme) {
      this.controls = generateControls(this.props.controlScheme, this.handleControl, this.props.scrollTimeout);
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
          tabIndex={-1}
          ref={innerRef ? composeRefs(this.rootRef, innerRef) : this.rootRef}
        >
          <RenderLayer
            ref={this.renderLayerRef}
            size={this.size}
            style={{ transform: transformStyle(this.position, this.zoom, this.size.offsetX, this.size.offsetY) }}
          >
            <div
              id={Identifier.CANVAS_OFFSET}
              ref={this.offsetLayerRef}
              style={{ transform: `translate(${this.size.offsetX}px, ${this.size.offsetY}px)` }}
            >
              {children}
            </div>
          </RenderLayer>

          {this.props.layers}
        </Container>
      </CanvasProvider>
    );
  }
}

export default withContext(DismissableLayerContext, 'dismissableLayer')(Canvas) as React.FC<CanvasProps>;
