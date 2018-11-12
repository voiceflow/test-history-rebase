import React, { Component } from 'react';
import Select from 'react-select'
import { Label } from 'reactstrap';

class Module extends Component {
    constructor(props) {
        super(props);

        let node = this.props.node;
        console.log("WUXY", node)
        // let parsed_input = JSON.parse(this.props.node.extras.inputs);
        // let parsed_output = JSON.parse(this.props.node.extras.outputs);
        // node.extras.inputs = parsed_input;
        // node.extras.outputs = parsed_output;

        // if(!node.extras.mapping) node.extras.mapping = {};

        // this.state = {
        //     node: node
        // }

        console.log('state', this.state)
        //this.selectVariable = this.selectVariable.bind(this);
    }

    /* 
    selectVariable(selected, index, type) {
        let node = this.state.node;
        if(!node.extras[type][index]) return;
        let defined_var = node.extras[type][index];

        if(!node.extras.mapping[defined_var]) node.extras.mapping[defined_var] = {};
        node.extras.mapping[defined_var][type] = selected.value;

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
                        this.state.node.extras.inputs.length > 0 ?
                            <React.Fragment> 
                                {this.state.node.extras.inputs.map((v, i) => {
                                    return <div key={i} className="variable_map mb-2">
                                        <Select
                                            className="map-box"
                                            classNamePrefix="variable-box"
                                            placeholder="Variable"
                                            value={this.state.node.extras.mapping[v] && this.state.node.extras.mapping[v].inputs 
                                                ? {label: '{' + this.state.node.extras.mapping[v].inputs + '}', value: this.state.node.extras.mapping[v].inputs} 
                                                : null}
                                            onChange={(select) => this.selectVariable(select, i, 'inputs')}
                                            options={Array.isArray(this.props.variables) ? this.props.variables.map(variable => {
                                                return {label: '{' + variable + '}', value: variable }
                                            }) : null}
                                        />
                                        <i className="far fa-arrow-right"/>
                                        <input readOnly className="map-box form-control" value={`{${v}}`}/>
                                    </div>
                                })}
                            </React.Fragment> 
                            : 
                            <i className="text-muted">No input variables exist for this module</i>
                    }
                </div>
                <hr/>
                <Label>Output Mapping</Label>
                <div>
                    {
                        this.state.node.extras.outputs.length > 0 ?
                            <React.Fragment> 
                                {this.state.node.extras.outputs.map((v, i) => {
                                    return <div key={i} className="variable_map mb-2 reverse">
                                        <Select
                                            className="map-box"
                                            classNamePrefix="variable-box"
                                            placeholder="Variable"
                                            value={this.state.node.extras.mapping[v] && this.state.node.extras.mapping[v].outputs 
                                                ? {label: '{' + this.state.node.extras.mapping[v].outputs + '}', value: this.state.node.extras.mapping[v].outputs} 
                                                : null}
                                            onChange={(select) => this.selectVariable(select, i, 'outputs')}
                                            options={Array.isArray(this.props.variables) ? this.props.variables.map(variable => {
                                                return {label: '{' + variable + '}', value: variable }
                                            }) : null}
                                        />
                                        <i className="far fa-arrow-right"/>
                                        <input readOnly className="map-box form-control" value={`{${v}}`}/>
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
    */
    render(){
        return (
            <div>
                <h1>Yo</h1>
            </div>
        )
    }
}

export default Module;