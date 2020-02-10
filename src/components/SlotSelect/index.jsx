import React from 'react';

import Flex, { FlexApart } from '@/components/Flex';
import Select from '@/components/Select';
import SvgIcon from '@/components/SvgIcon';
import { connect } from '@/hocs';
import { activeSlotTypes } from '@/store/selectors';

import { ALEXA_SLOT_PATTERN, GOOGLE_SLOT_PATTERN } from './constants';

const slotOptionRenderer = (option) => {
  const isAlexa = ALEXA_SLOT_PATTERN.test(option.value);
  const isGoogle = GOOGLE_SLOT_PATTERN.test(option.value);
  const isGlobal = !isAlexa && !isGoogle;

  return (
    <FlexApart fullWidth>
      {option.label}
      <Flex>
        {(isAlexa || isGlobal) && <SvgIcon icon="amazon" color="#BECEDC" />}
        {(isGoogle || isGlobal) && <SvgIcon icon="google" color="#BECEDC" />}
      </Flex>
    </FlexApart>
  );
};

const SlotSelect = ({ value, onChange, className, slotTypes, ...props }) => {
  const selected = slotTypes.find((slotType) => slotType.value === value) || null;

  return (
    <Select
      placeholder="Select Slot Type"
      value={selected ? selected.label : null}
      onSelect={onChange}
      options={slotTypes}
      getOptionValue={(option) => option.value}
      renderOptionLabel={slotOptionRenderer}
      {...props}
    />
  );
};

const mapStateToProps = {
  slotTypes: activeSlotTypes,
};

export default connect(mapStateToProps)(SlotSelect);
