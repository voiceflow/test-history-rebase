import { PlatformType } from '@voiceflow/internal';
import { FlexApart, SvgIcon } from '@voiceflow/ui';
import _toLower from 'lodash/toLower';
import React from 'react';

import { SPACE_REGEXP } from '@/constants';
import { isCustomizeableBuiltInIntent } from '@/utils/intent';
import { createPlatformSelector } from '@/utils/platform';
import { isGeneralPlatform } from '@/utils/typeGuards';

const getPlatformIcon = createPlatformSelector(
  {
    [PlatformType.ALEXA]: 'amazon',
    [PlatformType.GOOGLE]: 'google',
  },
  'inFlow'
);

const getFormatedLabel = (label, searchLabel, platform) => {
  const formattedLabel = isGeneralPlatform(platform) ? _toLower(label) : _toLower(label)?.replace(SPACE_REGEXP, '_');
  const substrs = (searchLabel && formattedLabel?.split(_toLower(searchLabel))) || [];

  if (substrs.length < 2) {
    return label;
  }

  const { res: strsToRender } = substrs.reduce(
    (acc, str, i) => {
      if (i === 0) {
        acc.res.push(label.substr(0, str.length));
        acc.length += str.length;
      } else {
        acc.res.push(label.substr(acc.length, searchLabel.length));
        acc.length += searchLabel.length;
        acc.res.push(label.substr(acc.length, str.length));
        acc.length += str.length;
      }

      return acc;
    },
    { res: [], length: 0 }
  );

  return strsToRender.map((str, i) => (i % 2 === 0 ? str : <b key={i}>{str}</b>));
};

const IntentOption = ({ option, searchLabel, getOptionLabel, getOptionValue, platform }) => (
  <FlexApart fullWidth>
    <span>{getFormatedLabel(getOptionLabel(getOptionValue(option)), searchLabel, platform)}</span>

    {isCustomizeableBuiltInIntent(option) && <SvgIcon icon={getPlatformIcon(option.platform)} color="#BECEDC" />}
  </FlexApart>
);

export default IntentOption;
