import type { GetOptionLabel, GetOptionValue, SvgIconTypes, UIOnlyMenuItemOption } from '@voiceflow/ui';
import { Checkbox, defaultMenuLabelRenderer, FlexApart, FlexStart, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import type { ReportTag } from '@/models';
import { isBuiltInTag, isSentimentTag } from '@/utils/reportTag';

const customMenuLabelRenderer = (
  option: Exclude<ReportTag, UIOnlyMenuItemOption>,
  searchLabel: string,
  getOptionLabel: GetOptionLabel<string>,
  getOptionValue: GetOptionValue<ReportTag, string>,
  isSelected: (val: string) => boolean
): React.ReactElement => (
  <FlexApart style={{ width: '100%' }}>
    <FlexStart>
      <Checkbox readOnly checked={isSelected(option.id)} />
      <div data-testid={option.id}>{defaultMenuLabelRenderer(option, searchLabel, getOptionLabel, getOptionValue)}</div>
    </FlexStart>

    {isBuiltInTag(option.id) &&
      (!isSentimentTag(option.id) && option.icon ? (
        <SvgIcon icon={option.icon as SvgIconTypes.Icon} color={option.iconColor} />
      ) : (
        <img alt="" width={18} height={18} src={option.icon} />
      ))}
  </FlexApart>
);

export default customMenuLabelRenderer;
