import _toLower from 'lodash/toLower';
import React from 'react';

import { FlexApart } from '@/components/Flex';
import SvgIcon from '@/components/SvgIcon';
import { PlatformType, SPACE_REGEXP } from '@/constants';

const PLATFORM_ICONS = {
  [PlatformType.ALEXA]: 'amazon',
  [PlatformType.GOOGLE]: 'google',
};

const getFormatedLabel = (label, searchLabel) => {
  const substrs = (searchLabel && _toLower(label)?.replace(SPACE_REGEXP, '_').split(_toLower(searchLabel))) || [];

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

function IntentOption({ option, searchLabel, getOptionLabel, getOptionValue }) {
  return (
    <FlexApart fullWidth>
      <span>{getFormatedLabel(getOptionLabel(getOptionValue(option)), searchLabel)}</span>

      {option.builtIn && <SvgIcon icon={PLATFORM_ICONS[option.platform]} color="#BECEDC" />}
    </FlexApart>
  );
}

export default IntentOption;
