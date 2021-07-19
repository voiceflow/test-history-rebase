import { IS_MAC } from '@voiceflow/ui';

export enum Hotkey {
  COPY = 'COPY',
  UNDO = 'UNDO',
  REDO = 'REDO',
  DELETE = 'DELETE',
  ZOOM_IN = 'ZOOM_IN',
  ZOOM_OUT = 'ZOOM_OUT',
  SPOTLIGHT = 'SPOTLIGHT',
  ROOT_NODE = 'ROOT_NODE',
  DESIGN_PAGE = 'DESIGN_PAGE',
  SETTINGS_PAGE = 'SETTINGS_PAGE',
  INTEGRATION_PAGE = 'INTEGRATION_PAGE',
  CONVERSATION_PAGE = 'CONVERSATION_PAGE',
  USER_SPEECH = 'USER_SPEECH',
  OPEN_CMS_MODAL = 'OPEN_CMS_MODAL',
  TOGGLE_LEFT_SIDEBAR_LOCK = 'TOGGLE_LEFT_SIDEBAR_LOCK',
  CLOSE_LEFT_SIDEBAR = 'CLOSE_LEFT_SIDEBAR',
  OPEN_LEFT_SIDEBAR_STEPS_TAB = 'OPEN_LEFT_SIDEBAR_STEPS_TAB',
  OPEN_LEFT_SIDEBAR_FLOWS_TAB = 'OPEN_LEFT_SIDEBAR_FLOWS_TAB',
  OPEN_COMMENTING = 'OPEN_COMMENTING',
  CLOSE_CANVAS_MODE = 'CLOSE_CANVAS_MODE',
  ADD_MARKUP_TEXT = 'ADD_MARKUP_TEXT',
  ADD_MARKUP_IMAGE = 'ADD_MARKUP_IMAGE',
  DUPLICATE = 'DUPLICATE',
  SHOW_HIDE_UI = 'SHOW_HIDE_UI',
  MOVE_FORWARD = 'MOVE_FORWARD',
  MOVE_BACKWARD = 'MOVE_BACKWARD',
  RUN_MODE = 'RUN_MODE',
  TEST_MODE = 'TEST_MODE',
  MOVE_MODE = 'MOVE_MODE',
  UPLOAD_PROJECT = 'UPLOAD_PROJECT',
  CLOSE_CANVAS_ONLY_MODE = 'CLOSE_CANVAS_ONLY_MODE',
  PROTOTYPE_CLOSE_FULL_SCREEN = 'PROTOTYPE_CLOSE_FULL_SCREEN',
  PROTOTYPE_FULL_SCREEN_TOGGLE = 'PROTOTYPE_FULL_SCREEN_TOGGLE',
}

enum SpecialKey {
  ESC = 'esc',
  LEFT = 'left',
  META = 'meta',
  CTRL = 'ctrl',
  EQUAL = '=',
  RIGHT = 'right',
  SHIFT = 'shift',
  SPACE = 'space',
  DELETE = 'del',
  BACKSPACE = 'backspace',
}

/**
 * syntax for keys can be found here:
 * https://craig.is/killing/mice
 */
const HOTKEY_MAPPING: Record<Hotkey, string | string[]> = {
  [Hotkey.COPY]: [`${SpecialKey.CTRL}+c`, `${SpecialKey.META}+c`],
  [Hotkey.UNDO]: [`${SpecialKey.CTRL}+z`, `${SpecialKey.META}+z`],
  [Hotkey.REDO]: [`${SpecialKey.CTRL}+${SpecialKey.SHIFT}+z`, `${SpecialKey.META}+${SpecialKey.SHIFT}+z`],
  [Hotkey.DELETE]: [SpecialKey.DELETE, SpecialKey.BACKSPACE],
  [Hotkey.ZOOM_IN]: [SpecialKey.EQUAL, `${SpecialKey.SHIFT}+${SpecialKey.EQUAL}`],
  [Hotkey.ZOOM_OUT]: ['-', `${SpecialKey.SHIFT}+-`],
  [Hotkey.RUN_MODE]: 'r',
  [Hotkey.TEST_MODE]: 't',
  [Hotkey.MOVE_MODE]: 'v',
  [Hotkey.ROOT_NODE]: 's',
  [Hotkey.SPOTLIGHT]: `${SpecialKey.SHIFT}+${SpecialKey.SPACE}`,
  [Hotkey.DUPLICATE]: [`${SpecialKey.CTRL}+d`, `${SpecialKey.META}+d`],
  [Hotkey.USER_SPEECH]: SpecialKey.SPACE,
  [Hotkey.DESIGN_PAGE]: '1',
  [Hotkey.CONVERSATION_PAGE]: '2',
  [Hotkey.SETTINGS_PAGE]: '4',
  [Hotkey.INTEGRATION_PAGE]: '3',
  [Hotkey.MOVE_FORWARD]: SpecialKey.RIGHT,
  [Hotkey.SHOW_HIDE_UI]: [`${SpecialKey.CTRL}+\\`, `${SpecialKey.META}+\\`],
  [Hotkey.MOVE_BACKWARD]: SpecialKey.LEFT,
  [Hotkey.UPLOAD_PROJECT]: [`${SpecialKey.CTRL}+u`, `${SpecialKey.META}+u`],
  [Hotkey.OPEN_CMS_MODAL]: 'm',
  [Hotkey.OPEN_COMMENTING]: 'c',
  [Hotkey.ADD_MARKUP_TEXT]: 't',
  [Hotkey.ADD_MARKUP_IMAGE]: 'i',
  [Hotkey.CLOSE_CANVAS_MODE]: SpecialKey.ESC,
  [Hotkey.CLOSE_LEFT_SIDEBAR]: SpecialKey.ESC,
  [Hotkey.CLOSE_CANVAS_ONLY_MODE]: SpecialKey.ESC,
  [Hotkey.TOGGLE_LEFT_SIDEBAR_LOCK]: ['/', '?'],
  [Hotkey.OPEN_LEFT_SIDEBAR_STEPS_TAB]: [',', `${SpecialKey.SHIFT}+,`],
  [Hotkey.OPEN_LEFT_SIDEBAR_FLOWS_TAB]: ['.', `${SpecialKey.SHIFT}+.`],
  [Hotkey.PROTOTYPE_CLOSE_FULL_SCREEN]: SpecialKey.ESC,
  [Hotkey.PROTOTYPE_FULL_SCREEN_TOGGLE]: 'f',
};

const SPECIAL_KEY_LABEL: Record<SpecialKey, string> = {
  [SpecialKey.ESC]: 'Esc',
  [SpecialKey.LEFT]: '<',
  [SpecialKey.META]: '⌘',
  [SpecialKey.CTRL]: 'Ctrl',
  [SpecialKey.EQUAL]: '+',
  [SpecialKey.RIGHT]: '>',
  [SpecialKey.SHIFT]: '⇧',
  [SpecialKey.SPACE]: 'Space',
  [SpecialKey.DELETE]: 'Del',
  [SpecialKey.BACKSPACE]: 'Del',
};

export const PLATFORM_META_KEY = IS_MAC ? SpecialKey.META : SpecialKey.CTRL;
export const PLATFORM_META_KEY_LABEL = SPECIAL_KEY_LABEL[PLATFORM_META_KEY];

const replaceSpecials = (label: string): string =>
  (Object.keys(SPECIAL_KEY_LABEL) as SpecialKey[]).reduce<string>(
    (acc, special) => acc.replace(special.toUpperCase(), SPECIAL_KEY_LABEL[special]),
    label
  );

const getHotkeyLabel = (hotkey: Hotkey): string => {
  let label = HOTKEY_MAPPING[hotkey];

  if (Array.isArray(label)) {
    const platformLabel = label.find((str) => str.includes(PLATFORM_META_KEY));

    label = platformLabel ?? label[0];
  }

  // for the mac platform remove '+' between ⌘ and hotkey
  const formattedLabel = IS_MAC ? label.replace(`${PLATFORM_META_KEY}+`, PLATFORM_META_KEY) : label;

  return replaceSpecials(formattedLabel.toUpperCase());
};

export const HOTKEY_LABEL_MAP = Object.values(Hotkey).reduce<Record<Hotkey, string>>(
  (acc, hotkey) => Object.assign(acc, { [hotkey]: getHotkeyLabel(hotkey) }),
  {} as Record<Hotkey, string>
);

export default HOTKEY_MAPPING;
