import { SvgIconTypes } from '@voiceflow/ui';

export enum ToolbarIcon {
  TEXT_BOLD = 'TEXT_BOLD',
  TEXT_ITALIC = 'TEXT_ITALIC',
  TEXT_UNDERLINE = 'TEXT_UNDERLINE',
  TEXT_STRIKE_THROUGH = 'TEXT_STRIKE_THROUGH',
  HYPERLINK = 'HYPERLINK',
  DELAY = 'DELAY',
}

export type ToolbarIcons = Record<ToolbarIcon, SvgIconTypes.Icon>;
