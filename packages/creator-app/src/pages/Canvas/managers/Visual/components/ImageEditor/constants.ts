import { Node } from '@voiceflow/base-types';

export const FRAME_OPTIONS = [
  { id: Node.Visual.FrameType.AUTO, label: 'Auto' },
  { id: Node.Visual.FrameType.CUSTOM_SIZE, label: 'Custom Size' },
  { id: Node.Visual.FrameType.DEVICE, label: 'Device' },
];

export const CANVAS_VISIBILITY_OPTIONS = [
  { id: Node.Visual.CanvasVisibility.FULL, label: 'Actual Size' },
  { id: Node.Visual.CanvasVisibility.CROPPED, label: 'Small' },
  { id: Node.Visual.CanvasVisibility.HIDDEN, label: 'Hidden' },
];

export const DEVICE_OPTIONS = [
  Node.Visual.DeviceType.MOBILE,
  Node.Visual.DeviceType.TABLET,
  Node.Visual.DeviceType.DESKTOP,
  Node.Visual.DeviceType.ECHO_SHOW_8,
  Node.Visual.DeviceType.GOOGLE_NEST_HUB,
  Node.Visual.DeviceType.SMART_WATCH,
  Node.Visual.DeviceType.TELEVISION,
  Node.Visual.DeviceType.IN_CAR_DISPLAY,
];
