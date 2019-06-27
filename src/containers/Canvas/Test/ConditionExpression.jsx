import cn from 'classnames';
import { selectStyles } from 'components/VariableSelect/VariableSelect';
import React, { useState } from 'react';
import Select from 'react-select';
import { Input } from 'reactstrap';

const ConditionExpression = (props) => {
  const [value, setValue] = useState();
  const [variable, setVariable] = useState();
  const { idx, first, last, variables, onSelection, addVariable, setSelected } = props;

  return (
    <>
      <div className="mb-3 px-3 d-flex">
        <div className="expression-container">
          <Select
            classNamePrefix="variable-box"
            placeholder="Variable Name"
            className="variable-box mb-2"
            styles={selectStyles}
            value={variable}
            options={variables}
            onChange={(selected) => {
              if (variable) {
                onSelection(variable.value, variable.value);
              }
              if (value) {
                onSelection(selected.value, value);
              }
              setVariable(selected);
            }}
            menuPortalTarget={document.querySelector('body')}
          />
          <Input
            type="text"
            placeholder="Enter value"
            onChange={(e) => {
              if (variable) {
                onSelection(variable.value, e.target.value);
              }
              setValue(e.target.value);
            }}
          />
        </div>
        <div className="expression-control mt-2">
          <button className={cn('expression-button expression-remove', { disabled: first })} onClick={() => setSelected(idx)} />
          <button className={cn('expression-button', { 'expression-add': first, invisible: !first })} onClick={() => addVariable()} />
        </div>
      </div>
      {!last && <div className="break-line mb-3" />}
    </>
  );
};
export default ConditionExpression;
