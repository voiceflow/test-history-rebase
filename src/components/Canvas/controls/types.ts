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

export type EndAction = {
  type: ControlType.END;
};

export type ClickAction = {
  type: ControlType.CLICK;
  event: MouseEvent;
};

export type ShiftMousedownAction = {
  type: ControlType.SHIFT_MOUSEDOWN;
  event: React.MouseEvent;
};

export type PanAction = {
  type: ControlType.PAN;
  deltaX: number;
  deltaY: number;
};

export type ControlAction = ZoomAction | EndAction | PanAction | ClickAction | ShiftMousedownAction;
