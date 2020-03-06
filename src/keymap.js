/**
 * syntax for keys can be found here:
 * https://craig.is/killing/mice
 */
export const Hotkey = {
  DELETE: 'DELETE',
  COPY: 'COPY',
  UNDO: 'UNDO',
  REDO: 'REDO',
  COMMENT: 'COMMENT',
  SPOTLIGHT: 'SPOTLIGHT',
  OPEN_BLOCK_MENU: 'OPEN_BLOCK_MENU',
  OPEN_FLOW_MENU: 'OPEN_FLOW_MENU',
  OPEN_VARIABLE_MENU: 'OPEN_VARIABLE_MENU',
  TOGGLE_LEFT_SIDEBAR_LOCK: 'TOGGLE_LEFT_SIDEBAR_LOCK',
  OPEN_LEFT_SIDEBAR_STEPS_TAB: 'OPEN_LEFT_SIDEBAR_STEPS_TAB',
  OPEN_LEFT_SIDEBAR_FLOWS_TAB: 'OPEN_LEFT_SIDEBAR_FLOWS_TAB',
};

const HOTKEY_MAPPING = {
  [Hotkey.DELETE]: ['del', 'backspace'],
  [Hotkey.COPY]: ['control+c', 'command+c'],
  [Hotkey.UNDO]: ['control+z', 'command+z'],
  [Hotkey.REDO]: ['control+shift+z', 'command+shift+z'],
  [Hotkey.COMMENT]: ['control+/', 'command+/'],
  [Hotkey.SPOTLIGHT]: 'space',
  [Hotkey.OPEN_BLOCK_MENU]: 'shift+1',
  [Hotkey.OPEN_FLOW_MENU]: 'shift+2',
  [Hotkey.OPEN_VARIABLE_MENU]: 'shift+3',
  [Hotkey.TOGGLE_LEFT_SIDEBAR_LOCK]: ['control+\\', 'command+\\'],
  [Hotkey.OPEN_LEFT_SIDEBAR_STEPS_TAB]: ['control+,', 'command+,'],
  [Hotkey.OPEN_LEFT_SIDEBAR_FLOWS_TAB]: ['control+.', 'command+.'],
};

export default HOTKEY_MAPPING;
