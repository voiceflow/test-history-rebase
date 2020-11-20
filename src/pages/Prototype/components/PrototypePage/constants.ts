import { SubMenuItem } from '@/components/SubMenu';
import { Icon } from '@/components/SvgIcon';
import { PlatformType } from '@/constants';
import { PrototypeMode } from '@/ducks/prototype/types';

export const DISPLAY_SECTION_WIDTH = 234;
export const DEVELOPER_SECTION_WIDTH = 320;

const canvasIcon: SubMenuItem = {
  value: PrototypeMode.CANVAS,
  icon: 'canvas',
};

const displayIcon: SubMenuItem = {
  value: PrototypeMode.DISPLAY,
  icon: 'display',
};

const developerIcon: SubMenuItem = {
  value: PrototypeMode.DEVELOPER,
  icon: 'developer',
};

const ALEXA_PROTOTYPE_MENU_OPTIONS: SubMenuItem[] = [canvasIcon, displayIcon, developerIcon];

const GOOGLE_PROTOTYPE_MENU_OPTIONS: SubMenuItem[] = [canvasIcon, developerIcon];

const GENERAL_PROTOTYPE_MENU_OPTIONS: SubMenuItem[] = [canvasIcon, developerIcon];

export const PROTOTYPE_MENU_OPTIONS = {
  [PlatformType.ALEXA]: ALEXA_PROTOTYPE_MENU_OPTIONS,
  [PlatformType.GOOGLE]: GOOGLE_PROTOTYPE_MENU_OPTIONS,
  [PlatformType.GENERAL]: GENERAL_PROTOTYPE_MENU_OPTIONS,
};

export enum DeviceType {
  ECHO_SHOW_10 = 'Echo Show 10',
  ECHO_SHOW_8 = 'Echo Show 8',
  ECHO_SPOT = 'Echo Spot',
  FIRE_TV_CUBE = 'Fire TV Cube',
  FIRE_HD_8 = 'Fire HD 8',
  FIRE_HD_10 = 'Fire HD 10',
}

export type Dimension = {
  width: number;
  height: number;
};

export type DeviceInfo = {
  name: string;
  dimension: Dimension;
  icon: Icon;
};

export const ALEXA_DEVICE_LIST: Record<DeviceType, DeviceInfo> = {
  [DeviceType.ECHO_SHOW_8]: {
    name: 'Echo Show 8',
    dimension: {
      width: 1024,
      height: 600,
    },
    icon: 'echoShow',
  },
  [DeviceType.ECHO_SHOW_10]: {
    name: 'Echo Show 10',
    dimension: {
      width: 1280,
      height: 800,
    },
    icon: 'echoShow',
  },
  [DeviceType.ECHO_SPOT]: {
    name: 'Echo Spot',
    dimension: {
      width: 480,
      height: 480,
    },
    icon: 'echoSpot',
  },
  [DeviceType.FIRE_TV_CUBE]: {
    name: 'Fire TV Cube',
    dimension: {
      width: 1920,
      height: 1080,
    },
    icon: 'fireTV',
  },
  [DeviceType.FIRE_HD_8]: {
    name: 'Fire HD 8',
    dimension: {
      width: 1200,
      height: 800,
    },
    icon: 'fireHD8',
  },
  [DeviceType.FIRE_HD_10]: {
    name: 'Fire HD 10',
    dimension: {
      width: 1920,
      height: 1200,
    },
    icon: 'fireHD10',
  },
};

export const DEVICE_LIST = {
  [PlatformType.ALEXA]: ALEXA_DEVICE_LIST,
  [PlatformType.GOOGLE]: {},
  [PlatformType.GENERAL]: {},
};
