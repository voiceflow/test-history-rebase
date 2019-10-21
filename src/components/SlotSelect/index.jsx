import cn from 'classnames';
import React from 'react';

import Select from '@/components/Select';
import { isLiveSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { activeSlotTypes } from '@/store/selectors';

import { Option, SingleValueOption } from './components';

const SlotSelect = ({ value, onChange, className, slotTypes, isLive, ...props }) => {
  const selected = slotTypes.find((slotType) => slotType.value === value) || null;

  return (
    <Select
      placeholder="Select Slot Type"
      classNamePrefix="select-box"
      className={cn('select-box', className)}
      value={selected}
      onChange={(result) => onChange(result.value)}
      options={slotTypes}
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
  slotTypes: activeSlotTypes,
  isLive: isLiveSelector,
};

export default connect(mapStateToProps)(SlotSelect);
