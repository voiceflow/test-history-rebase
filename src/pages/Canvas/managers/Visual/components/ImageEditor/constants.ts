import { DeviceType } from '@voiceflow/general-types';
import { CanvasVisibility } from '@voiceflow/general-types/build/nodes/visual';

export enum FrameType {
  DEVICE = 'DEVICE',
  CUSTOM_SIZE = 'CUSTOM_SIZE',
}

export const FRAME_OPTIONS = [
  { id: FrameType.DEVICE, label: 'Device' },
  { id: FrameType.CUSTOM_SIZE, label: 'Custom Size' },
];

export const CANVAS_VISIBILITY_OPTIONS = [
  { id: CanvasVisibility.FULL, label: 'Actual Size' },
  { id: CanvasVisibility.CROPPED, label: 'Small' },
  { id: CanvasVisibility.HIDDEN, label: 'Hidden' },
];

export const DEVICE_OPTIONS = [
  DeviceType.MOBILE,
  DeviceType.TABLET,
  DeviceType.DESKTOP,
  DeviceType.ECHO_SHOW_8,
  DeviceType.GOOGLE_NEST_HUB,
  DeviceType.SMART_WATCH,
  DeviceType.TELEVISION,
  DeviceType.IN_CAR_DISPLAY,
];
