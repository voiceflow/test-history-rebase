import { IconName } from '@voiceflow/icons';
import { IS_MAC } from '@voiceflow/ui';
import { IHotKey } from '@voiceflow/ui-next';
import moize from 'moize';

export enum Hotkey {
  CUT = 'CUT',
  COPY = 'COPY',
  UNDO = 'UNDO',
  REDO = 'REDO',
  DELETE = 'DELETE',
  SUBMIT = 'SUBMIT',
  SEARCH = 'SEARCH',
  NATIVE_SEARCH = 'NATIVE_SEARCH',
  ZOOM_IN = 'ZOOM_IN',
  ZOOM_OUT = 'ZOOM_OUT',
  SPOTLIGHT = 'SPOTLIGHT',
  ROOT_NODE = 'ROOT_NODE',
  SELECT_ALL = 'SELECT_ALL',
  ESC_CLOSE = 'ESC_CLOSE',

  USER_SPEECH = 'USER_SPEECH',
  OPEN_MANUAL_SAVE_MODAL = 'OPEN_MANUAL_SAVE_MODAL',
  HIDE_COMMENT_BUBBLES = 'HIDE_COMMENT_BUBBLES',

  FOCUS_DASHBOARD_SEARCH = 'FOCUS_DASHBOARD_SEARCH',
  FOCUS_KB_MANAGER_SEARCH = 'FOCUS_KB_MANAGER_SEARCH',

  OPEN_COMMENTING = 'OPEN_COMMENTING',
  CLOSE_CANVAS_MODE = 'CLOSE_CANVAS_MODE',
  ADD_MARKUP_NOTE = 'ADD_MARKUP_NOTE',
  ADD_MARKUP_IMAGE = 'ADD_MARKUP_IMAGE',
  DUPLICATE = 'DUPLICATE',
  CREATE_COMPONENT = 'CREATE_COMPONENT',
  CREATE_SUBTOPIC = 'CREATE_SUBTOPIC',
  ADD_TO_LIBRARY = 'ADD_TO_LIBRARY',
  MOVE_FORWARD = 'MOVE_FORWARD',
  SAVE_BACKUP = 'SAVE_BACKUP',
  MOVE_BACKWARD = 'MOVE_BACKWARD',
  RUN_MODE = 'RUN_MODE',
  MOVE_MODE = 'MOVE_MODE',
  UPLOAD_PROJECT = 'UPLOAD_PROJECT',
  MULTISTEP_CONTINUE_NEXT_STEP = 'MULTISTEP_CONTINUE_NEXT_STEP',
  PROTOTYPE_CLOSE_FULL_SCREEN = 'PROTOTYPE_CLOSE_FULL_SCREEN',
  PROTOTYPE_FULL_SCREEN_TOGGLE = 'PROTOTYPE_FULL_SCREEN_TOGGLE',
  SAVE = 'SAVE',
  CLOSE_UPLOAD_MODAL = 'CLOSE_UPLOAD_MODAL',
  MODAL_CLOSE = 'MODAL_CLOSE',
  MODAL_SUBMIT = 'MODAL_SUBMIT',

  NLU_TABLE_TAB = 'NLU_TABLE_TAB',
  NLU_TABLE_ESC = 'NLU_TABLE_ESC',

  GPT_GEN_NEXT_ITEM = 'GPT_GEN_NEXT_ITEM',
  GPT_GEN_PREV_ITEM = 'GPT_GEN_PREV_ITEM',
  GPT_GEN_ACCEPT_ALL = 'GPT_GEN_ACCEPT_ALL',
  GPT_GEN_REJECT_ALL = 'GPT_GEN_REJECT_ALL',
  GPT_GEN_ACCEPT_ITEM = 'GPT_GEN_ACCEPT_ITEM',
  GPT_GEN_REJECT_ITEM = 'GPT_GEN_REJECT_ITEM',

  TOGGLE_CHATBOT = 'TOGGLE_CHATBOT',

  BACK_TO_CMS = 'BACK_TO_CMS',
  BACK_TO_DESIGNER = 'BACK_TO_DESIGNER',
  CANVAS_SHOW_HIDE_UI = 'CANVAS_SHOW_HIDE_UI',
  CANVAS_TOGGLE_SIDEBAR = 'CANVAS_TOGGLE_SIDEBAR',
}

enum SpecialKey {
  UP = 'up',
  TAB = 'tab',
  ESC = 'esc',
  LEFT = 'left',
  META = 'meta',
  CTRL = 'ctrl',
  DOWN = 'down',
  ENTER = 'enter',
  EQUAL = '=',
  RIGHT = 'right',
  SHIFT = 'shift',
  SPACE = 'space',
  DELETE = 'del',
  OPTION = 'alt',
  BACKSPACE = 'backspace',
}

/**
 * syntax for keys can be found here:
 * https://craig.is/killing/mice
 */
const HOTKEY_MAPPING: Record<Hotkey, string | string[]> = {
  [Hotkey.CUT]: [`${SpecialKey.CTRL}+x`, `${SpecialKey.META}+x`],
  [Hotkey.COPY]: [`${SpecialKey.CTRL}+c`, `${SpecialKey.META}+c`],
  [Hotkey.UNDO]: [`${SpecialKey.CTRL}+z`, `${SpecialKey.META}+z`],
  [Hotkey.REDO]: [`${SpecialKey.CTRL}+${SpecialKey.SHIFT}+z`, `${SpecialKey.META}+${SpecialKey.SHIFT}+z`],
  [Hotkey.SUBMIT]: SpecialKey.ENTER,
  [Hotkey.DELETE]: [SpecialKey.DELETE, SpecialKey.BACKSPACE],
  [Hotkey.ESC_CLOSE]: SpecialKey.ESC,
  [Hotkey.SELECT_ALL]: [`${SpecialKey.CTRL}+a`, `${SpecialKey.META}+a`],
  [Hotkey.ZOOM_IN]: [SpecialKey.EQUAL, `${SpecialKey.SHIFT}+${SpecialKey.EQUAL}`],
  [Hotkey.ZOOM_OUT]: ['-', `${SpecialKey.SHIFT}+-`],
  [Hotkey.RUN_MODE]: 'r',
  [Hotkey.MULTISTEP_CONTINUE_NEXT_STEP]: SpecialKey.ENTER,
  [Hotkey.MOVE_MODE]: 'v',
  [Hotkey.ROOT_NODE]: 's',
  [Hotkey.SPOTLIGHT]: `${SpecialKey.SHIFT}+${SpecialKey.SPACE}`,
  [Hotkey.NATIVE_SEARCH]: [`${SpecialKey.CTRL}+f`, `${SpecialKey.META}+f`],
  [Hotkey.SEARCH]: [`${SpecialKey.CTRL}+k`, `${SpecialKey.META}+k`],
  [Hotkey.DUPLICATE]: [`${SpecialKey.CTRL}+d`, `${SpecialKey.META}+d`],
  [Hotkey.CREATE_SUBTOPIC]: [`${SpecialKey.CTRL}+g`, `${SpecialKey.META}+g`],
  [Hotkey.CREATE_COMPONENT]: [`${SpecialKey.SHIFT}+${SpecialKey.CTRL}+k`, `${SpecialKey.SHIFT}+${SpecialKey.META}+k`],
  [Hotkey.ADD_TO_LIBRARY]: [`${SpecialKey.SHIFT}+${SpecialKey.CTRL}+l`, `${SpecialKey.SHIFT}+${SpecialKey.META}+l`],
  [Hotkey.USER_SPEECH]: SpecialKey.SPACE,
  [Hotkey.MOVE_FORWARD]: SpecialKey.RIGHT,
  [Hotkey.SAVE_BACKUP]: [`${SpecialKey.CTRL} + S`, `${SpecialKey.META} + S`],
  [Hotkey.MOVE_BACKWARD]: SpecialKey.LEFT,
  [Hotkey.UPLOAD_PROJECT]: [`${SpecialKey.CTRL}+u`, `${SpecialKey.META}+u`],
  [Hotkey.OPEN_COMMENTING]: 'c',
  [Hotkey.ADD_MARKUP_NOTE]: 'n',
  [Hotkey.ADD_MARKUP_IMAGE]: 'i',
  [Hotkey.CLOSE_CANVAS_MODE]: SpecialKey.ESC,
  [Hotkey.CANVAS_SHOW_HIDE_UI]: [`${SpecialKey.CTRL}+.`, `${SpecialKey.META}+.`],
  [Hotkey.CANVAS_TOGGLE_SIDEBAR]: [`${SpecialKey.CTRL}+\\`, `${SpecialKey.META}+\\`],
  [Hotkey.PROTOTYPE_CLOSE_FULL_SCREEN]: SpecialKey.ESC,
  [Hotkey.PROTOTYPE_FULL_SCREEN_TOGGLE]: 'f',
  [Hotkey.OPEN_MANUAL_SAVE_MODAL]: [`${SpecialKey.SHIFT}+${SpecialKey.CTRL}+s`, `${SpecialKey.SHIFT}+${SpecialKey.META}+s`],
  [Hotkey.SAVE]: [`${SpecialKey.META}+s`, `${SpecialKey.CTRL}+s`],
  [Hotkey.CLOSE_UPLOAD_MODAL]: SpecialKey.ESC,
  [Hotkey.HIDE_COMMENT_BUBBLES]: [`${SpecialKey.SHIFT}+c`],
  [Hotkey.FOCUS_DASHBOARD_SEARCH]: '/',
  [Hotkey.FOCUS_KB_MANAGER_SEARCH]: '/',

  [Hotkey.MODAL_CLOSE]: SpecialKey.ESC,
  [Hotkey.MODAL_SUBMIT]: [`${SpecialKey.CTRL}+${SpecialKey.ENTER}`, `${SpecialKey.META}+${SpecialKey.ENTER}`],

  [Hotkey.NLU_TABLE_TAB]: SpecialKey.TAB,
  [Hotkey.NLU_TABLE_ESC]: SpecialKey.ESC,

  [Hotkey.GPT_GEN_NEXT_ITEM]: SpecialKey.DOWN,
  [Hotkey.GPT_GEN_PREV_ITEM]: SpecialKey.UP,
  [Hotkey.GPT_GEN_ACCEPT_ALL]: [`${SpecialKey.CTRL}+${SpecialKey.ENTER}`, `${SpecialKey.META}+${SpecialKey.ENTER}`],
  [Hotkey.GPT_GEN_REJECT_ALL]: SpecialKey.ESC,
  [Hotkey.GPT_GEN_ACCEPT_ITEM]: SpecialKey.ENTER,
  [Hotkey.GPT_GEN_REJECT_ITEM]: [SpecialKey.DELETE, SpecialKey.BACKSPACE],

  [Hotkey.TOGGLE_CHATBOT]: [`${SpecialKey.CTRL}+/`, `${SpecialKey.META}+/`],
  [Hotkey.BACK_TO_CMS]: [`${SpecialKey.CTRL}+[`, `${SpecialKey.META}+[`],
  [Hotkey.BACK_TO_DESIGNER]: [`${SpecialKey.CTRL}+]`, `${SpecialKey.META}+]`],
};

const SPECIAL_KEY_LABEL: Record<SpecialKey, string> = {
  [SpecialKey.UP]: '↑',
  [SpecialKey.ESC]: 'Esc',
  [SpecialKey.TAB]: 'Tab',
  [SpecialKey.DOWN]: '↓',
  [SpecialKey.LEFT]: '←',
  [SpecialKey.META]: '⌘',
  [SpecialKey.CTRL]: 'Ctrl',
  [SpecialKey.ENTER]: 'Enter',
  [SpecialKey.EQUAL]: '+',
  [SpecialKey.RIGHT]: '→',
  [SpecialKey.SHIFT]: '⇧',
  [SpecialKey.SPACE]: 'Space',
  [SpecialKey.OPTION]: IS_MAC ? '⌥' : 'Alt',
  [SpecialKey.DELETE]: 'Del',
  [SpecialKey.BACKSPACE]: 'Del',
};

const SPECIAL_KEY_ICON_NAME: Partial<Record<SpecialKey, IconName>> = {
  [SpecialKey.META]: 'Command',
  [SpecialKey.SHIFT]: 'Shift',
};

export const PLATFORM_META_KEY = IS_MAC ? SpecialKey.META : SpecialKey.CTRL;
export const PLATFORM_META_KEY_LABEL = SPECIAL_KEY_LABEL[PLATFORM_META_KEY];

const replaceSpecials = (label: string): string =>
  (Object.keys(SPECIAL_KEY_LABEL) as SpecialKey[]).reduce<string>(
    (acc, special) => acc.replace(special.toUpperCase(), SPECIAL_KEY_LABEL[special]),
    label
  );

export const getHotkeyLabel = (hotkey: Hotkey): string => {
  let label = HOTKEY_MAPPING[hotkey];

  if (Array.isArray(label)) {
    const platformLabel = label.find((str) => str.includes(PLATFORM_META_KEY));

    label = platformLabel ?? label[0];
  }

  // for the mac platform remove '+' between ⌘ and ⌥ and hotkeys
  const formattedLabel = IS_MAC
    ? label.replace(`${PLATFORM_META_KEY}+`, PLATFORM_META_KEY).replace(`${SpecialKey.OPTION}+`, SpecialKey.OPTION)
    : label;

  return replaceSpecials(formattedLabel.toUpperCase());
};

export const getHotkeys = moize(
  (hotkey: Hotkey): IHotKey[] => {
    let label = HOTKEY_MAPPING[hotkey];

    if (Array.isArray(label)) {
      const platformLabel = label.find((str) => str.includes(PLATFORM_META_KEY));

      label = platformLabel ?? label[0];
    }

    return label.split('+').map((key) => {
      if (SPECIAL_KEY_ICON_NAME[key as SpecialKey]) {
        return { iconName: SPECIAL_KEY_ICON_NAME[key as SpecialKey] };
      }

      if (SPECIAL_KEY_LABEL[key as SpecialKey]) {
        return { label: SPECIAL_KEY_LABEL[key as SpecialKey] };
      }

      return { label: key.toUpperCase() };
    });
  },
  { maxSize: Object.values(Hotkey).length }
);

export const HOTKEY_LABEL_MAP = Object.values(Hotkey).reduce<Record<Hotkey, string>>(
  (acc, hotkey) => Object.assign(acc, { [hotkey]: getHotkeyLabel(hotkey) }),
  {} as Record<Hotkey, string>
);

export default HOTKEY_MAPPING;
