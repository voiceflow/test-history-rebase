import CommandsManager from './components/CommandsManager';

export const COMMANDS_PATH_TYPE = 'commands';

export const EDITORS_BY_PATH = {
  [COMMANDS_PATH_TYPE]: CommandsManager,
};
