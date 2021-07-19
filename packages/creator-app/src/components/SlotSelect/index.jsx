import { FlexApart, Select } from '@voiceflow/ui';
import React from 'react';

import * as Version from '@/ducks/version';
import { connect } from '@/hocs';

const slotOptionRenderer = (option) => <FlexApart fullWidth>{option.label}</FlexApart>;

const SlotSelect = ({ value, onChange, className, slotTypes, filter, ...props }) => {
  const selected = slotTypes.find((slotType) => slotType.value === value) || null;
  const options = React.useMemo(() => (filter ? slotTypes.filter(filter) : slotTypes), [slotTypes, filter]);

  return (
    <Select
      placeholder="Select Entity Type"
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
  slotTypes: Version.activeSlotTypesSelector,
};

export default connect(mapStateToProps)(SlotSelect);
