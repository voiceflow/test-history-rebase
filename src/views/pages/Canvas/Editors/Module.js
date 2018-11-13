import React, { Component } from 'react';
import Select from 'react-select'
import { Label } from 'reactstrap';

class Module extends Component {
    constructor(props) {
        super(props);

        let node = this.props.node;
        this.state = {
            node: node
        }

        this.selectVariable = this.selectVariable.bind(this);
    }

    selectVariable(selected, index, type) {
        let node = this.state.node;

        if(type === 'inputs'){
            node.extras.mapping.inputs[index].val = selected['value'];
        }else if(type === 'outputs'){
            node.extras.mapping.outputs[index].val = selected['value'];
        }

        this.setState({
            node: node
        });
    }

    render() {
        return (
            <React.Fragment>
                <Label>Input Mapping</Label>
                <div>
                    {
                        this.state.node.extras.mapping.inputs.length > 0 ?
                            <React.Fragment> 
                                {this.state.node.extras.mapping.inputs.map((v, i) => {
                                    return <div key={i} className="variable_map mb-2">
                                        <Select
                                            className="map-box"
                                            classNamePrefix="variable-box"
                                            placeholder="Variable"
                                            value={v.val ? {label: '{' + v.val + '}', value: v.val} : null}
                                            onChange={(select) => this.selectVariable(select, i, 'val')}
                                            options={Array.isArray(this.props.variables) ? this.props.variables.map(variable => {
                                                return {label: '{' + variable + '}', value: variable }
                                            }) : null}
                                        />
                                        <i className="far fa-arrow-right"/>
                                        <input readOnly className="map-box form-control" value={`{${v.key}}`}/>
                                    </div>
                                })}
                            </React.Fragment> 
                            : 
                            <i className="text-muted">No input variables exist for this module</i>
                    }
                </div>
                <hr/>
                <div>
                    <Label>Output Mapping</Label>
                    {
                        this.state.node.extras.mapping.outputs.length > 0 ?
                            <React.Fragment> 
                                {this.state.node.extras.mapping.outputs.map((v, i) => {
                                    return <div key={i} className="variable_map mb-2 reverse">
                                        <Select
                                            className="map-box"
                                            classNamePrefix="variable-box"
                                            placeholder="Variable"
                                            value={v.val ? {label: '{' + v.val + '}', value: v.val} : null}
                                            onChange={(select) => this.selectVariable(select, i, 'val')}
                                            options={Array.isArray(this.props.variables) ? this.props.variables.map(variable => {
                                                return {label: '{' + variable + '}', value: variable }
                                            }) : null}
                                        />
                                        <i className="far fa-arrow-right"/>
                                        <input readOnly className="map-box form-control" value={`{${v.key}}`}/>
                                    </div>
                                })}
                            </React.Fragment> 
                            : 
                            <i className="text-muted">No output variables exist for this module</i>
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default Module;