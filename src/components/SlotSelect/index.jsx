import React from 'react';

import Flex, { FlexApart } from '@/components/Flex';
import Select from '@/components/Select';
import SvgIcon from '@/components/SvgIcon';
import { connect } from '@/hocs';
import { activeSlotTypes } from '@/store/selectors';

import { ALEXA_SLOT_PATTERN, GOOGLE_SLOT_PATTERN } from './constants';

const slotOptionRenderer = (option) => {
  const isAlexa = option?.value.match(ALEXA_SLOT_PATTERN);
  const isGoogle = option?.value.match(GOOGLE_SLOT_PATTERN);
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

const SlotSelect = ({ value, onChange, className, slotTypes, filter, ...props }) => {
  const selected = slotTypes.find((slotType) => slotType.value === value) || null;
  const options = React.useMemo(() => {
    return filter ? slotTypes.filter(filter) : slotTypes;
  }, [slotTypes, filter]);

  return (
    <Select
      placeholder="Select Slot Type"
      value={selected ? selected.label : null}
      onSelect={onChange}
      options={options}
      getOptionValue={(option) => option.value}
      renderOptionLabel={slotOptionRenderer}
      searchable
      {...props}
    />
  );
};

const mapStateToProps = {
  slotTypes: activeSlotTypes,
};

export default connect(mapStateToProps)(SlotSelect);
