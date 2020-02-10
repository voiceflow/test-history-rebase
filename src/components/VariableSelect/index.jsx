/* eslint-disable no-shadow */
import React from 'react';

import Select from '@/components/Select';
import { addGlobalVariable } from '@/ducks/skill';
import { connect } from '@/hocs';
import { allVariablesSelector } from '@/store/selectors';

export const VariableSelect = ({ value, variables, addVariable, onChange, ...props }) => {
  const onCreate = (item) => {
    addVariable(item);
    onChange(item);
  };

  return (
    <Select
      value={value}
      options={variables}
      onSelect={onChange}
      onCreate={onCreate}
      creatable
      searchable
      placeholder="Select Variable"
      createInputPlaceholder="Variable"
      {...props}
    />
  );
};

const mapStateToProps = {
  variables: allVariablesSelector,
};

const mapDispatchToProps = {
  addVariable: addGlobalVariable,
};

export default connect(mapStateToProps, mapDispatchToProps)(VariableSelect);
