import { ControlScheme } from './constants';

export type CanvasAPI = {
  getControlScheme: () => ControlScheme;
  isPanning: () => boolean;
  isTrackpadPanning: () => boolean;
  getZoom: () => number;
  getPosition: () => [number, number];
  getRef: () => HTMLElement;
  getRect: () => DOMRect;
  zoomIn: (delta: number, options: unknown) => void;
  zoomOut: (delta: number, options: unknown) => void;
  reorient: () => void;

  setZoom: (zoom: number, options: unknown) => void;

  setPosition: (position: [number, number], options: unknown) => void;

  applyStyles: (styles: unknown) => void;

  applyTransition: (options: unknown) => void;

  transformPoint: (point: [number, number], relative?: boolean) => [number, number];

  mapPoint: (point: [number, number]) => [number, number];

  reverseTransformPoint: (point: [number, number], relative?: boolean) => [number, number];

  reverseMapPoint: (point: [number, number]) => [number, number];
};
