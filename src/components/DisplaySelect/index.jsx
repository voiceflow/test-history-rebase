import React from 'react';

import Select from '@/components/Select';
import { allDisplaysSelector, displayByIDSelector } from '@/ducks/display';
import { connect } from '@/hocs';

const DisplaySelect = ({ selected, onChange, displays }) => (
  <Select
    classNamePrefix="select-box"
    value={selected ? { value: selected.id, label: selected.name } : null}
    onChange={(result) => onChange(result.value)}
    placeholder="Select Multimodal Display"
    options={displays.map((display) => ({ value: display.id, label: display.name }))}
  />
);

const mapStateToProps = {
  displays: allDisplaysSelector,
  selected: displayByIDSelector,
};

const mergeProps = ({ selected: getDisplayByID }, _, { value }) => ({
  selected: value && getDisplayByID(value),
});

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(DisplaySelect);
