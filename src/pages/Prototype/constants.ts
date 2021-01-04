import { SubMenuItem } from '@/components/SubMenu';
import { Icon } from '@/components/SvgIcon';
import { PlatformType } from '@/constants';
import { PrototypeMode } from '@/ducks/prototype/types';

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
  density: number;
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
      density: 160,
      width: 1024,
      height: 600,
    },
    icon: 'echoShow',
  },
  [DeviceType.ECHO_SHOW_10]: {
    name: 'Echo Show 10',
    dimension: {
      density: 126,
      width: 1280,
      height: 800,
    },
    icon: 'echoShow',
  },
  [DeviceType.ECHO_SPOT]: {
    name: 'Echo Spot',
    dimension: {
      density: 192,
      width: 480,
      height: 480,
    },
    icon: 'echoSpot',
  },
  [DeviceType.FIRE_TV_CUBE]: {
    name: 'Fire TV Cube',
    dimension: {
      // chosen as it's the average recommended TV pixel density
      density: 110,
      width: 1920,
      height: 1080,
    },
    icon: 'fireTV',
  },
  [DeviceType.FIRE_HD_8]: {
    name: 'Fire HD 8',
    dimension: {
      density: 150,
      width: 1200,
      height: 800,
    },
    icon: 'fireHD8',
  },
  [DeviceType.FIRE_HD_10]: {
    name: 'Fire HD 10',
    dimension: {
      density: 190,
      width: 1920,
      height: 1200,
    },
    icon: 'fireHD10',
  },
};

export const DEVICE_LIST: Record<PlatformType, Partial<Record<DeviceType, DeviceInfo>>> = {
  [PlatformType.ALEXA]: ALEXA_DEVICE_LIST,
  [PlatformType.GOOGLE]: {},
  [PlatformType.GENERAL]: {},
};
