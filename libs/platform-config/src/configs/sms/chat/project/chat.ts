import * as Base from '@/configs/base';

export const CONFIG = Base.Project.Chat.extend({
  toolbarOptions: [],
  messageDelay: false,
})(Base.Project.Voice.validate);

export type Config = typeof CONFIG;
