import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';

export enum ToolbarOption {
  TEXT_BOLD = 'TEXT_BOLD',
  TEXT_ITALIC = 'TEXT_ITALIC',
  TEXT_UNDERLINE = 'TEXT_UNDERLINE',
  TEXT_STRIKE_THROUGH = 'TEXT_STRIKE_THROUGH',
  HYPERLINK = 'HYPERLINK',
}

export interface Config {
  toolbarOptions: ToolbarOption[];
  messageDelay: boolean;
}

export const CONFIG = Types.satisfies<Config>()({
  toolbarOptions: [
    ToolbarOption.TEXT_BOLD,
    ToolbarOption.TEXT_ITALIC,
    ToolbarOption.TEXT_UNDERLINE,
    ToolbarOption.TEXT_STRIKE_THROUGH,
    ToolbarOption.HYPERLINK,
  ],
  messageDelay: true,
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
