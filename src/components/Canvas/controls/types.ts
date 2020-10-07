import React from 'react';

import { Either } from '@/types';

import { ControlType } from '../constants';

export type GestureEvent = UIEvent & {
  scale?: number;
};

export type TrackpadZoomAction = {
  type: ControlType.SCALE;
  scale: number;
  event: GestureEvent;
};

export type MouseZoomAction = {
  type: ControlType.SCALE;
  delta: number;
  event: WheelEvent;
};

export type ZoomAction = Either<TrackpadZoomAction, MouseZoomAction>;

export type StartInteraction = {
  type: ControlType.START_INTERACTION;
};

export type EndIneraction = {
  type: ControlType.END_INTERACTION;
};

export type EndAction = {
  type: ControlType.END;
};

export type ClickAction = {
  type: ControlType.CLICK;
  event: React.MouseEvent;
};

export type MouseUpAction = {
  type: ControlType.MOUSE_UP;
  event: MouseEvent;
};

export type ShiftDragStartAction = {
  type: ControlType.SELECT_DRAG_START;
  event: React.DragEvent;
};

export type PanAction = {
  type: ControlType.PAN;
  deltaX: number;
  deltaY: number;
};

export type ControlAction =
  | ZoomAction
  | StartInteraction
  | EndIneraction
  | EndAction
  | PanAction
  | ClickAction
  | MouseUpAction
  | ShiftDragStartAction;
