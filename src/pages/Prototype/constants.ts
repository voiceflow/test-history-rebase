import { DeviceType, Dimensions } from '@voiceflow/general-types';

import { SubMenuItem } from '@/components/SubMenu';
import { Icon } from '@/components/SvgIcon';
import { PlatformType } from '@/constants';
import { PrototypeMode } from '@/ducks/prototype';

const canvasIcon: SubMenuItem = {
  value: PrototypeMode.CANVAS,
  icon: 'canvas',
};

const displayIcon: SubMenuItem = {
  value: PrototypeMode.DISPLAY,
  icon: 'display',
};

const developerIcon: SubMenuItem = {
  value: PrototypeMode.VARIABLES,
  icon: 'code',
};

const settingsIcon: SubMenuItem = {
  value: PrototypeMode.SETTINGS,
  icon: 'cog',
};

const ALEXA_PROTOTYPE_MENU_OPTIONS: SubMenuItem[] = [canvasIcon, displayIcon, developerIcon, settingsIcon];

const GOOGLE_PROTOTYPE_MENU_OPTIONS: SubMenuItem[] = [canvasIcon, developerIcon, settingsIcon];

const GENERAL_PROTOTYPE_MENU_OPTIONS: SubMenuItem[] = [canvasIcon, displayIcon, developerIcon, settingsIcon];

export const PROTOTYPE_MENU_OPTIONS = {
  [PlatformType.ALEXA]: ALEXA_PROTOTYPE_MENU_OPTIONS,
  [PlatformType.GOOGLE]: GOOGLE_PROTOTYPE_MENU_OPTIONS,
  [PlatformType.GENERAL]: GENERAL_PROTOTYPE_MENU_OPTIONS,
};

export type DeviceInfo = {
  name: string;
  icon: Icon;
  type: DeviceType;
  dimension: Dimensions & { density: number };
};

export const ALEXA_DEVICE_LIST: DeviceInfo[] = [
  {
    type: DeviceType.ECHO_SHOW_8,
    name: 'Echo Show 8',
    icon: 'echoShow',
    dimension: { width: 1024, height: 600, density: 160 },
  },

  {
    type: DeviceType.ECHO_SHOW_10,
    name: 'Echo Show 10',
    icon: 'echoShow',
    dimension: { width: 1280, height: 800, density: 160 },
  },

  {
    type: DeviceType.ECHO_SPOT,
    name: 'Echo Spot',
    icon: 'echoSpot',
    dimension: { width: 480, height: 480, density: 160 },
  },
  {
    type: DeviceType.FIRE_TV_CUBE,
    name: 'Fire TV Cube',
    icon: 'fireTV',
    // chosen as it's the average recommended TV pixel density
    dimension: { width: 1920, height: 1080, density: 160 },
  },
  {
    type: DeviceType.FIRE_HD_8,
    name: 'Fire HD 8',
    icon: 'fireHD8',
    dimension: { width: 1200, height: 800, density: 160 },
  },
  {
    type: DeviceType.FIRE_HD_10,
    name: 'Fire HD 10',
    icon: 'fireHD10',
    dimension: { width: 1920, height: 1200, density: 160 },
  },
];

export const DEVICE_LIST: Record<PlatformType, DeviceInfo[]> = {
  [PlatformType.ALEXA]: ALEXA_DEVICE_LIST,
  [PlatformType.GOOGLE]: [],
  [PlatformType.GENERAL]: [],
};
