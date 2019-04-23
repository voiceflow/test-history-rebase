import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import Select from 'react-select';
import VariableInput from './VariableInput';
import { openTab } from 'ducks/user'
import { selectStyles, variableComponent } from 'views/components/VariableSelect'

class APIMapping extends Component {

    render() {
        return (
            <React.Fragment>
                <div>
                    {this.props.addButtonOrientation === 'top' && <button className="btn btn-clear btn-block btn-bg mb-2" onClick={this.props.onAdd}>
                        <i className="far fa-plus mr-2"></i> Add Output Mapping
                    </button>}
                    {Array.isArray(this.props.pairs) ? this.props.pairs.map((choice, i) => {
                        return (
                            <div key={choice.index} className="mb-2">
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            {i + 1}
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <VariableInput className="form-control no-radius form-control-border" placeholder="object path" updateRaw={e => this.props.onChange(e, i, 'path')} variables={this.props.variables} raw={choice.path} />
                                    <Select
                                        classNamePrefix="variable-box"
                                        styles={selectStyles}
                                        placeholder="Variable"
                                        className="variable-box right"
                                        components={{ Option: variableComponent }}
                                        value={this.props.pairs[i]['var'] ? { value: this.props.pairs[i]['var'], label: this.props.pairs[i]['var'] } : null}
                                        onChange={e => this.props.onChange(e.value, i, 'var')}
                                        options={Array.isArray(this.props.variables) ? this.props.variables.map(variable => {
                                            return { label: variable, value: variable, openVar: this.props.openVarTab }
                                        }) : null}
                                    />
                                    <button className="close-small ml-2" onClick={e => this.props.onRemove(e, i)}></button>
                                </InputGroup>
                            </div>)
                    }) : null}
                    {this.props.addButtonOrientation !== 'top' && <button className="btn btn-clear btn-block btn-lg" onClick={this.props.onAdd}>
                        <i className="far fa-plus mr-2"></i> Add Output Mapping
                    </button>}
                </div>

            </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        openVarTab: (tab) => dispatch(openTab(tab)),
    }
}

export default connect(null, mapDispatchToProps)(APIMapping);
