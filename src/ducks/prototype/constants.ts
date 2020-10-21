import { SubMenuItem } from '@/components/SubMenu';
import { PlatformType } from '@/constants';

import { PrototypeMode } from './types';

export const STATE_KEY = 'prototype';

const ALEXA_PROTOTYPE_MENU_OPTIONS: SubMenuItem[] = [
  {
    value: PrototypeMode.CANVAS,
    icon: 'canvas',
  },
  {
    value: PrototypeMode.DISPLAY,
    icon: 'display',
  },
  {
    value: PrototypeMode.DEVELOPER,
    icon: 'developer',
  },
];

const GOOGLE_PROTOTYPE_MENU_OPTIONS: SubMenuItem[] = [
  {
    value: PrototypeMode.CANVAS,
    icon: 'canvas',
  },
  {
    value: PrototypeMode.DEVELOPER,
    icon: 'developer',
  },
];

const GENERAL_PROTOTYPE_MENU_OPTIONS: SubMenuItem[] = [
  {
    value: PrototypeMode.CANVAS,
    icon: 'canvas',
  },
  {
    value: PrototypeMode.DEVELOPER,
    icon: 'developer',
  },
];

export const PROTOTYPE_MENU_OPTIONS = {
  [PlatformType.ALEXA]: ALEXA_PROTOTYPE_MENU_OPTIONS,
  [PlatformType.GOOGLE]: GOOGLE_PROTOTYPE_MENU_OPTIONS,
  [PlatformType.GENERAL]: GENERAL_PROTOTYPE_MENU_OPTIONS,
};
