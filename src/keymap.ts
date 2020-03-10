/**
 * syntax for keys can be found here:
 * https://craig.is/killing/mice
 */
export enum Hotkey {
  COPY = 'COPY',
  UNDO = 'UNDO',
  REDO = 'REDO',
  DELETE = 'DELETE',
  COMMENT = 'COMMENT',
  ZOOM_IN = 'ZOOM_IN',
  ZOOM_OUT = 'ZOOM_OUT',
  SPOTLIGHT = 'SPOTLIGHT',
  OPEN_CMS_MODAL = 'OPEN_CMS_MODAL',
  OPEN_FLOW_MENU = 'OPEN_FLOW_MENU',
  OPEN_BLOCK_MENU = 'OPEN_BLOCK_MENU',
  OPEN_VARIABLE_MENU = 'OPEN_VARIABLE_MENU',
  OPEN_RESOURCES_DROPDOWN = 'OPEN_RESOURCES_DROPDOWN',
  TOGGLE_LEFT_SIDEBAR_LOCK = 'TOGGLE_LEFT_SIDEBAR_LOCK',
  OPEN_LEFT_SIDEBAR_STEPS_TAB = 'OPEN_LEFT_SIDEBAR_STEPS_TAB',
  OPEN_LEFT_SIDEBAR_FLOWS_TAB = 'OPEN_LEFT_SIDEBAR_FLOWS_TAB',
}

const HOTKEY_MAPPING = {
  [Hotkey.COPY]: ['control+c', 'command+c'],
  [Hotkey.UNDO]: ['control+z', 'command+z'],
  [Hotkey.REDO]: ['control+shift+z', 'command+shift+z'],
  [Hotkey.DELETE]: ['del', 'backspace'],
  [Hotkey.COMMENT]: ['control+/', 'command+/'],
  [Hotkey.ZOOM_IN]: ['control+=', 'command+='],
  [Hotkey.ZOOM_OUT]: ['control+-', 'command+-'],
  [Hotkey.SPOTLIGHT]: 'space',
  [Hotkey.OPEN_CMS_MODAL]: ['control+m', 'command+m'],
  [Hotkey.OPEN_FLOW_MENU]: 'shift+2',
  [Hotkey.OPEN_BLOCK_MENU]: 'shift+1',
  [Hotkey.OPEN_VARIABLE_MENU]: 'shift+3',
  [Hotkey.OPEN_RESOURCES_DROPDOWN]: ['control+i', 'command+i'],
  [Hotkey.TOGGLE_LEFT_SIDEBAR_LOCK]: ['control+\\', 'command+\\'],
  [Hotkey.OPEN_LEFT_SIDEBAR_STEPS_TAB]: ['control+,', 'command+,'],
  [Hotkey.OPEN_LEFT_SIDEBAR_FLOWS_TAB]: ['control+.', 'command+.'],
};

export default HOTKEY_MAPPING;
