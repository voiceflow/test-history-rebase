import { Base } from '@voiceflow/platform-config';

import { ToolbarIcons } from './types';

const { ToolbarOption } = Base.Project.Chat;

export const TOOLBAR_ICONS: ToolbarIcons = {
  [ToolbarOption.TEXT_BOLD]: 'systemBold',
  [ToolbarOption.TEXT_ITALIC]: 'systemItalic',
  [ToolbarOption.TEXT_UNDERLINE]: 'systemUnderscore',
  [ToolbarOption.TEXT_STRIKE_THROUGH]: 'systemStrikeThrough',
  [ToolbarOption.HYPERLINK]: 'systemLinkText',
};
