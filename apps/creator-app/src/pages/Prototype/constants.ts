import { BaseNode } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import { Utils } from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';

export interface DeviceInfo {
  name: string;
  icon: SvgIconTypes.Icon;
  type: BaseNode.Visual.DeviceType;
  dimension: BaseNode.Visual.Dimensions & { density: number };
}

export const ALEXA_DEVICES: DeviceInfo[] = [
  {
    type: BaseNode.Visual.DeviceType.ECHO_SHOW_8,
    name: 'Echo Show 8',
    icon: 'echoShow',
    dimension: { width: 1024, height: 600, density: 160 },
  },

  {
    type: BaseNode.Visual.DeviceType.ECHO_SHOW_10,
    name: 'Echo Show 10',
    icon: 'echoShow',
    dimension: { width: 1280, height: 800, density: 160 },
  },

  {
    type: BaseNode.Visual.DeviceType.ECHO_SPOT,
    name: 'Echo Spot',
    icon: 'echoSpot',
    dimension: { width: 480, height: 480, density: 160 },
  },
  {
    type: BaseNode.Visual.DeviceType.FIRE_TV_CUBE,
    name: 'Fire TV Cube',
    icon: 'fireTV',
    // chosen as it's the average recommended TV pixel density
    dimension: { width: 1920, height: 1080, density: 160 },
  },
  {
    type: BaseNode.Visual.DeviceType.FIRE_HD_8,
    name: 'Fire HD 8',
    icon: 'fireHD8',
    dimension: { width: 1200, height: 800, density: 160 },
  },
  {
    type: BaseNode.Visual.DeviceType.FIRE_HD_10,
    name: 'Fire HD 10',
    icon: 'fireHD10',
    dimension: { width: 1920, height: 1200, density: 160 },
  },
];

export const ALL_DEVICES = [...ALEXA_DEVICES];

export const getDeviceList = Utils.platform.createPlatformSelector<DeviceInfo[]>(
  {
    [Platform.Constants.PlatformType.ALEXA]: ALEXA_DEVICES,
  },
  []
);
