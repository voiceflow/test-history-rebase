import cn from 'classnames';
import React from 'react';

import { components } from '@/components/Select';
import { connect } from '@/hocs';
import { allVariablesSelector } from '@/store/selectors';

import Control from './components/VariableSelectControl';
import CreateVariable from './components/VariableSelectCreate';
import Option from './components/VariableSelectOption';

const Menu = ({ children, ...props }) => (
  <components.Menu {...props}>
    {children}
    <CreateVariable />
  </components.Menu>
);

const VariableSelect = ({ value, onChange, variables, className, ...props }) => {
  return (
    <Control
      classNamePrefix="variable-box"
      placeholder={variables.length ? 'Select Variable' : 'No Variables Exist'}
      className={cn('variable-box', className)}
      components={{ Option, Menu }}
      value={value ? { label: `{${value}}`, value } : null}
      onChange={(selected) => onChange(selected.value, selected.label)}
      options={variables.map((variable) => ({ label: `{${variable}}`, value: variable }))}
      {...props}
    />
  );
};

const mapStateToProps = {
  variables: allVariablesSelector,
};

export default connect(mapStateToProps)(VariableSelect);
