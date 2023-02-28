import React from 'react';

import { Either } from '@/types';

import { ControlScheme, ControlType } from '../constants';

export type GestureEvent = UIEvent & {
  scale?: number;
};

export interface TrackpadZoomAction {
  type: ControlType.SCALE;
  scale: number;
  event: GestureEvent;
}

export interface MouseZoomAction {
  type: ControlType.SCALE;
  delta: number;
  event: WheelEvent;
}

export type ZoomAction = Either<TrackpadZoomAction, MouseZoomAction>;

export interface StartInteraction {
  type: ControlType.START_INTERACTION;
}

export interface EndIneraction {
  type: ControlType.END_INTERACTION;
}

export interface EndAction {
  type: ControlType.END;
}

export interface ClickAction {
  type: ControlType.CLICK;
  event: React.MouseEvent;
}

export interface MouseUpAction {
  type: ControlType.MOUSE_UP;
  event: MouseEvent;
}

export interface StartPanning {
  type: ControlType.START_PANNING;
}

export interface StopPanning {
  type: ControlType.STOP_PANNING;
}

export interface ShiftDragStartAction {
  type: ControlType.SELECT_DRAG_START;
  event: React.DragEvent;
}

export interface PanAction {
  type: ControlType.PAN;
  deltaX: number;
  deltaY: number;
}

export type ControlAction =
  | ZoomAction
  | StartInteraction
  | EndIneraction
  | EndAction
  | PanAction
  | ClickAction
  | MouseUpAction
  | StartPanning
  | StopPanning
  | ShiftDragStartAction;

export interface ControlInterface {
  readonly isPanning: boolean;
  scheme: ControlScheme | null;
  click: (event: React.MouseEvent) => void;
  mousedown: (event: MouseEvent) => void;
  dragstart: (event: React.DragEvent) => void;
  wheel: (event: WheelEvent) => void;
  gesturestart: (event: GestureEvent) => void;
  gesturechange: (event: GestureEvent) => void;
  keyup: (event: KeyboardEvent) => void;
  keydown: (event: KeyboardEvent) => void;
}

export type GenerateControlInterface<T extends any[] = []> = (handle: (action: ControlAction) => void, ...args: T) => ControlInterface;
