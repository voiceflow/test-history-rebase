import cn from 'classnames';
import React from 'react';

import Select from '@/components/Select';
import { PlatformType } from '@/constants';
import { allIntentsSelector } from '@/ducks/intent';
import { activePlatformSelector, isLiveSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { ALEXA_BUILT_INS, GOOGLE_BUILT_INS } from '@/utils/intent';

import { Option, SingleValueOption } from './components';

const IntentSelect = ({ value, onChange, intents, platform, isLive, className, ...props }) => {
  const options = intents
    .filter((intent) => !intent.platform || intent.platform === platform)
    .concat(platform === PlatformType.GOOGLE ? GOOGLE_BUILT_INS : ALEXA_BUILT_INS)
    .map((intent) => {
      const intentParts = intent.name.split('.');
      const id = intent.built_in ? intent.key : intent.id;

      return {
        label: intent.built_in ? intentParts[intentParts.length - 1] : intent.name,
        value: id,
        key: id,
        inputs: intent.inputs,
        built_in: intent.built_in,
      };
    });

  const selected = options.find((option) => option.value === value) || null;

  return (
    <Select
      placeholder="Select Intent"
      className={cn('select-box', 'mb-1', className)}
      classNamePrefix="select-box"
      value={selected}
      onChange={(result) => onChange(result.value)}
      options={options}
      components={{ Option, SingleValue: SingleValueOption }}
      styles={{
        singleValue: (base) => ({ ...base, width: '100%' }),
      }}
      isDisabled={isLive}
      {...props}
    />
  );
};

const mapStateToProps = {
  platform: activePlatformSelector,
  intents: allIntentsSelector,
  isLive: isLiveSelector,
};

export default connect(mapStateToProps)(IntentSelect);
