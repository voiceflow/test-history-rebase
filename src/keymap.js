/**
 * syntax for keys can be found here:
 * https://craig.is/killing/mice
 */
export const Hotkey = {
  DELETE: 'DELETE',
  COPY: 'COPY',
  COMMENT: 'COMMENT',
  SPOTLIGHT: 'SPOTLIGHT',
  OPEN_BLOCK_MENU: 'OPEN_BLOCK_MENU',
  OPEN_FLOW_MENU: 'OPEN_FLOW_MENU',
  OPEN_VARIABLE_MENU: 'OPEN_VARIABLE_MENU',
};

const HOTKEY_MAPPING = {
  [Hotkey.DELETE]: ['del', 'backspace'],
  [Hotkey.COPY]: ['control+c', 'command+c'],
  [Hotkey.COMMENT]: ['control+/', 'command+/'],
  [Hotkey.SPOTLIGHT]: 'space',
  [Hotkey.OPEN_BLOCK_MENU]: 'shift+1',
  [Hotkey.OPEN_FLOW_MENU]: 'shift+2',
  [Hotkey.OPEN_VARIABLE_MENU]: 'shift+3',
};

export default HOTKEY_MAPPING;
