import cn from 'classnames';
import Button from 'components/Button';
import { selectStyles, variableComponent } from 'components/VariableSelect/VariableSelect';
import { openTab } from 'ducks/user';
import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

const OutputMapping = (props) => (
  <>
    {props.arguments.map((argument, i) => {
      return (
        <div key={i} className="super-center mb-2">
          <div
            className={cn('variable_map', {
              reverse: props.reverse,
            })}
          >
            <Select
              styles={selectStyles}
              classNamePrefix="select-box"
              className="integrations-output-box"
              value={argument.arg1 || null}
              onChange={(selected) => props.handleSelection(i, 'arg1', selected)}
              placeholder="Column"
              options={Array.isArray(props.arg1_options) ? props.arg1_options : null}
            />
            <img src="/arrow-right.svg" alt="comment" className="mr-2 ml-2" width="7px" />
            <Select
              styles={selectStyles}
              components={{ Option: variableComponent }}
              classNamePrefix="variable-box"
              className="integrations-output-box"
              value={argument.arg2 ? { label: `{${argument.arg2}}`, variable: argument.arg2 } : null}
              onChange={(selected) => props.handleSelection(i, 'arg2', selected.value)}
              placeholder="Variable"
              options={
                Array.isArray(props.arg2_options)
                  ? props.arg2_options.map((variable, idx) => {
                      if (idx === props.arg2_options.length - 1) {
                        return { label: variable, value: variable, openVar: props.openVarTab };
                      }
                      return { label: `{${variable}}`, value: variable };
                    })
                  : null
              }
            />
          </div>
          <Button isCloseSmall className="ml-2" onClick={() => props.onRemove(i)} />
        </div>
      );
    })}
    <Button isBtn isClear isLarge isBlock onClick={props.onAdd}>
      <i className="far fa-plus mr-2" /> Add Mapping
    </Button>
  </>
);

const mapDispatchToProps = (dispatch) => {
  return {
    openVarTab: (tab) => dispatch(openTab(tab)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(OutputMapping);
