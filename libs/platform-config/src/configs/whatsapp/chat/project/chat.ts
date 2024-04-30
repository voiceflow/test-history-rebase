import * as Base from '@/configs/base';

export const CONFIG = Base.Project.Chat.extend({
  toolbarOptions: [
    Base.Project.Chat.ToolbarOption.TEXT_BOLD,
    Base.Project.Chat.ToolbarOption.TEXT_ITALIC,
    Base.Project.Chat.ToolbarOption.TEXT_UNDERLINE,
  ],
  messageDelay: false,
})(Base.Project.Voice.validate);

export type Config = typeof CONFIG;
