import React from 'react';

import { FlexApart } from '@/components/Flex';
import Select from '@/components/Select';
import { connect } from '@/hocs';
import { activeSlotTypesSelector } from '@/store/selectors';

const slotOptionRenderer = (option) => {
  return <FlexApart fullWidth>{option.label}</FlexApart>;
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
  slotTypes: activeSlotTypesSelector,
};

export default connect(mapStateToProps)(SlotSelect);
