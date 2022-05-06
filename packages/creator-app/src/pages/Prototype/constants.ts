import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/realtime-sdk';
import { Icon } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { SidebarIconMenuItem } from '@/components/SidebarIconMenu';
import { PrototypeMode } from '@/constants/prototype';
import { Identifier } from '@/styles/constants';

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

export const getMenuOptions = Utils.platform.createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: ALEXA_PROTOTYPE_MENU_OPTIONS,
    [VoiceflowConstants.PlatformType.GOOGLE]: GOOGLE_PROTOTYPE_MENU_OPTIONS,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: DIALOGFLOW_PROTOTYPE_MENU_OPTIONS,
  },
  GENERAL_PROTOTYPE_MENU_OPTIONS
);

export interface DeviceInfo {
  name: string;
  icon: Icon;
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
    [VoiceflowConstants.PlatformType.ALEXA]: ALEXA_DEVICES,
  },
  []
);
