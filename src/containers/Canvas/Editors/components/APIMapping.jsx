import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';

import Button from '@/components/Button';
import { selectStyles, variableComponent } from '@/components/VariableSelect/VariableSelect';
import { openTab } from '@/ducks/user';

import VariableInput from './VariableInput';

class APIMapping extends Component {
  render() {
    return (
      <div>
        {this.props.addButtonOrientation === 'top' && (
          <Button isBtn isClear isBlock isLarge className="mb-2" onClick={this.props.onAdd}>
            <i className="far fa-plus mr-2" /> Add Output Mapping
          </Button>
        )}
        {Array.isArray(this.props.pairs)
          ? this.props.pairs.map((choice, i) => {
              return (
                <div key={choice.index} className="mb-2">
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>{i + 1}</InputGroupText>
                    </InputGroupAddon>
                    <VariableInput
                      className="form-control no-radius form-control-border"
                      placeholder="object path"
                      updateRaw={(e) => this.props.onChange(e, i, 'path')}
                      variables={this.props.variables}
                      raw={choice.path}
                    />
                    <Select
                      classNamePrefix="variable-box"
                      styles={selectStyles}
                      placeholder="Variable"
                      className="variable-box right"
                      components={{ Option: variableComponent }}
                      value={this.props.pairs[i].var ? { value: this.props.pairs[i].var, label: this.props.pairs[i].var } : null}
                      onChange={(e) => this.props.onChange(e.value, i, 'var')}
                      options={
                        Array.isArray(this.props.variables)
                          ? this.props.variables.map((variable) => {
                              return { label: variable, value: variable, openVar: this.props.openVarTab };
                            })
                          : null
                      }
                    />
                    <Button isCloseSmall className="ml-2" onClick={(e) => this.props.onRemove(e, i)} />
                  </InputGroup>
                </div>
              );
            })
          : null}
        {this.props.addButtonOrientation !== 'top' && (
          <Button isBtn isClear isBlock isLarge onClick={this.props.onAdd}>
            <i className="far fa-plus mr-2" /> Add Output Mapping
          </Button>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openVarTab: (tab) => dispatch(openTab(tab)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(APIMapping);
