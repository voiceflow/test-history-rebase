import _toLower from 'lodash/toLower';
import React from 'react';

import { FlexApart } from '@/components/Flex';
import SvgIcon from '@/components/SvgIcon';
import { PlatformType, SPACE_REGEXP } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { isCustomizeableBuiltInIntent } from '@/utils/intent';

const PLATFORM_ICONS = {
  [PlatformType.ALEXA]: 'amazon',
  [PlatformType.GOOGLE]: 'google',
  [PlatformType.GENERAL]: 'inFlow',
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

const IntentOption = ({ option, searchLabel, platform, getOptionLabel, getOptionValue }) => (
  <FlexApart fullWidth>
    <span>{getFormatedLabel(getOptionLabel(getOptionValue(option)), searchLabel)}</span>

    {isCustomizeableBuiltInIntent(option) && <SvgIcon icon={PLATFORM_ICONS[platform]} color="#BECEDC" />}
  </FlexApart>
);

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
};

export default connect(mapStateToProps)(IntentOption);
