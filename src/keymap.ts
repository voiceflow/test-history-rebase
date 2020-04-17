export enum Hotkey {
  COPY = 'COPY',
  UNDO = 'UNDO',
  REDO = 'REDO',
  DELETE = 'DELETE',
  COMMENT = 'COMMENT',
  ZOOM_IN = 'ZOOM_IN',
  ZOOM_OUT = 'ZOOM_OUT',
  SPOTLIGHT = 'SPOTLIGHT',
  ROOT_NODE = 'ROOT_NODE',
  BUILD_PAGE = 'BUILD_PAGE',
  DESIGN_PAGE = 'DESIGN_PAGE',
  USER_SPEECH = 'USER_SPEECH',
  PROTOTYPE_PAGE = 'PROTOTYPE_PAGE',
  OPEN_CMS_MODAL = 'OPEN_CMS_MODAL',
  OPEN_FLOW_MENU = 'OPEN_FLOW_MENU',
  OPEN_BLOCK_MENU = 'OPEN_BLOCK_MENU',
  OPEN_VARIABLE_MENU = 'OPEN_VARIABLE_MENU',
  OPEN_RESOURCES_DROPDOWN = 'OPEN_RESOURCES_DROPDOWN',
  TOGGLE_LEFT_SIDEBAR_LOCK = 'TOGGLE_LEFT_SIDEBAR_LOCK',
  OPEN_LEFT_SIDEBAR_STEPS_TAB = 'OPEN_LEFT_SIDEBAR_STEPS_TAB',
  OPEN_LEFT_SIDEBAR_FLOWS_TAB = 'OPEN_LEFT_SIDEBAR_FLOWS_TAB',
}

/**
 * syntax for keys can be found here:
 * https://craig.is/killing/mice
 */
const HOTKEY_MAPPING = {
  [Hotkey.COPY]: ['ctrl+c', 'command+c'],
  [Hotkey.UNDO]: ['ctrl+z', 'command+z'],
  [Hotkey.REDO]: ['ctrl+shift+z', 'command+shift+z'],
  [Hotkey.DELETE]: ['del', 'backspace'],
  [Hotkey.COMMENT]: ['ctrl+/', 'command+/'],
  [Hotkey.ZOOM_IN]: ['=', 'shift+='],
  [Hotkey.ZOOM_OUT]: ['-', 'shift+-'],
  [Hotkey.ROOT_NODE]: 'h',
  [Hotkey.SPOTLIGHT]: 'space',
  [Hotkey.USER_SPEECH]: 'space',
  [Hotkey.OPEN_CMS_MODAL]: 'm',
  [Hotkey.OPEN_FLOW_MENU]: 'shift+2',
  [Hotkey.OPEN_BLOCK_MENU]: 'shift+1',
  [Hotkey.OPEN_VARIABLE_MENU]: 'shift+3',
  [Hotkey.OPEN_RESOURCES_DROPDOWN]: 'i',
  [Hotkey.DESIGN_PAGE]: '1',
  [Hotkey.PROTOTYPE_PAGE]: '2',
  [Hotkey.BUILD_PAGE]: '3',
  [Hotkey.TOGGLE_LEFT_SIDEBAR_LOCK]: ['/', '?'],
  [Hotkey.OPEN_LEFT_SIDEBAR_STEPS_TAB]: ['shift+,', ','],
  [Hotkey.OPEN_LEFT_SIDEBAR_FLOWS_TAB]: ['shift+.', '.'],
};

export default HOTKEY_MAPPING;
