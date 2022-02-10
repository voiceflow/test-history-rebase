import { BaseNode } from '@voiceflow/base-types';

export const FRAME_OPTIONS = [
  { id: BaseNode.Visual.FrameType.AUTO, label: 'Auto' },
  { id: BaseNode.Visual.FrameType.CUSTOM_SIZE, label: 'Custom Size' },
  { id: BaseNode.Visual.FrameType.DEVICE, label: 'Device' },
];

export const CANVAS_VISIBILITY_OPTIONS = [
  { id: BaseNode.Visual.CanvasVisibility.FULL, label: 'Actual Size' },
  { id: BaseNode.Visual.CanvasVisibility.CROPPED, label: 'Small' },
  { id: BaseNode.Visual.CanvasVisibility.HIDDEN, label: 'Hidden' },
];

export const DEVICE_OPTIONS = [
  BaseNode.Visual.DeviceType.MOBILE,
  BaseNode.Visual.DeviceType.TABLET,
  BaseNode.Visual.DeviceType.DESKTOP,
  BaseNode.Visual.DeviceType.ECHO_SHOW_8,
  BaseNode.Visual.DeviceType.GOOGLE_NEST_HUB,
  BaseNode.Visual.DeviceType.SMART_WATCH,
  BaseNode.Visual.DeviceType.TELEVISION,
  BaseNode.Visual.DeviceType.IN_CAR_DISPLAY,
];
