import React, { Component } from 'react';
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import Select from 'react-select';
import VariableInput from './VariableInput';

class APIMapping extends Component {

    render() {
        return (
            <React.Fragment>
                <div>
                    {Array.isArray(this.props.pairs) ? this.props.pairs.map((choice, i) => {
                        return (
                            <div key={choice.index} className="mb-2">
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            {i+1}
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <VariableInput className="form-control" placeholder="object path" updateRaw={e => this.props.onChange(e, i, 'path')} variables={this.props.variables} raw={choice.path}/>
                                    <Select
                                        classNamePrefix="variable-box"
                                        placeholder="Variable"
                                        className="variable-box"
                                        value={this.props.pairs[i]['var'] ? {value: this.props.pairs[i]['var'], label: this.props.pairs[i]['var']} : null}
                                        onChange={e => this.props.onChange(e.value, i, 'var')} 
                                        options={Array.isArray(this.props.variables) ? this.props.variables.map(variable => {
                                            return {label: variable, value: variable}
                                        }) : null}
                                    />
                                    <InputGroupAddon addonType="append">
                                        <InputGroupText>
                                            <button className="close" onClick={e => this.props.onRemove(e, i)}>&times;</button>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            </div> )
                    }) : null}
                    <button className="btn btn-default btn-block" onClick={this.props.onAdd}>
                        <i className="far fa-plus"></i> Add Mapping
                    </button>
                </div>

            </React.Fragment>
        );
    }
}

export default APIMapping;
