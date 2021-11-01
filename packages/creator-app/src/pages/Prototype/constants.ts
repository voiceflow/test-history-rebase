import { Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import { Icon } from '@voiceflow/ui';

import { SidebarIconMenuItem } from '@/components/SidebarIconMenu';
import { PrototypeMode } from '@/ducks/prototype';
import { Identifier } from '@/styles/constants';
import { createPlatformSelector } from '@/utils/platform';

export interface PrototypeMenuItem extends SidebarIconMenuItem {
  value: PrototypeMode;
}

const canvasIcon: PrototypeMenuItem = {
  id: Identifier.PROTO_MENU_CANVAS_BUTTON,
  icon: 'canvas',
  value: PrototypeMode.CANVAS,
  tooltip: { title: 'Canvas' },
};

const displayIcon: PrototypeMenuItem = {
  id: Identifier.PROTO_MENU_DISPLAY_BUTTON,
  icon: 'display',
  value: PrototypeMode.DISPLAY,
  tooltip: { title: 'Display' },
};

const developerIcon: PrototypeMenuItem = {
  id: Identifier.PROTO_MENU_DEVELOPER_BUTTON,
  icon: 'code',
  value: PrototypeMode.VARIABLES,
  tooltip: { title: 'Variables' },
};

const settingsIcon: PrototypeMenuItem = {
  id: Identifier.PROTO_MENU_SETTINGS_BUTTON,
  icon: 'cog',
  value: PrototypeMode.SETTINGS,
  tooltip: { title: 'Settings' },
};

const ALEXA_PROTOTYPE_MENU_OPTIONS: PrototypeMenuItem[] = [canvasIcon, displayIcon, developerIcon, settingsIcon];

const GOOGLE_PROTOTYPE_MENU_OPTIONS: PrototypeMenuItem[] = [canvasIcon, developerIcon, settingsIcon];

const DIALOGFLOW_PROTOTYPE_MENU_OPTIONS: PrototypeMenuItem[] = [canvasIcon, developerIcon, settingsIcon];

const GENERAL_PROTOTYPE_MENU_OPTIONS: PrototypeMenuItem[] = [canvasIcon, displayIcon, developerIcon, settingsIcon];

export const getMenuOptions = createPlatformSelector(
  {
    [Constants.PlatformType.ALEXA]: ALEXA_PROTOTYPE_MENU_OPTIONS,
    [Constants.PlatformType.GOOGLE]: GOOGLE_PROTOTYPE_MENU_OPTIONS,
    [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: DIALOGFLOW_PROTOTYPE_MENU_OPTIONS,
    [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: DIALOGFLOW_PROTOTYPE_MENU_OPTIONS,
  },
  GENERAL_PROTOTYPE_MENU_OPTIONS
);

export interface DeviceInfo {
  name: string;
  icon: Icon;
  type: Node.Visual.DeviceType;
  dimension: Node.Visual.Dimensions & { density: number };
}

export const ALEXA_DEVICES: DeviceInfo[] = [
  {
    type: Node.Visual.DeviceType.ECHO_SHOW_8,
    name: 'Echo Show 8',
    icon: 'echoShow',
    dimension: { width: 1024, height: 600, density: 160 },
  },

  {
    type: Node.Visual.DeviceType.ECHO_SHOW_10,
    name: 'Echo Show 10',
    icon: 'echoShow',
    dimension: { width: 1280, height: 800, density: 160 },
  },

  {
    type: Node.Visual.DeviceType.ECHO_SPOT,
    name: 'Echo Spot',
    icon: 'echoSpot',
    dimension: { width: 480, height: 480, density: 160 },
  },
  {
    type: Node.Visual.DeviceType.FIRE_TV_CUBE,
    name: 'Fire TV Cube',
    icon: 'fireTV',
    // chosen as it's the average recommended TV pixel density
    dimension: { width: 1920, height: 1080, density: 160 },
  },
  {
    type: Node.Visual.DeviceType.FIRE_HD_8,
    name: 'Fire HD 8',
    icon: 'fireHD8',
    dimension: { width: 1200, height: 800, density: 160 },
  },
  {
    type: Node.Visual.DeviceType.FIRE_HD_10,
    name: 'Fire HD 10',
    icon: 'fireHD10',
    dimension: { width: 1920, height: 1200, density: 160 },
  },
];

export const ALL_DEVICES = [...ALEXA_DEVICES];

export const getDeviceList = createPlatformSelector<DeviceInfo[]>(
  {
    [Constants.PlatformType.ALEXA]: ALEXA_DEVICES,
  },
  []
);
