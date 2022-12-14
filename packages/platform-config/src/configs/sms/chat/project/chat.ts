import * as Base from '@platform-config/configs/base';

export const CONFIG = Base.Project.Chat.extend({
  toolbarOptions: [],
  messageDelay: false,
})(Base.Project.Voice.validate);

export type Config = typeof CONFIG;
