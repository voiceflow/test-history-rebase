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

        console.log('state', this.state)
        this.selectVariable = this.selectVariable.bind(this);
    }

    selectVariable(selected, index, type, key) {
        let node = this.state.node;

        if(type === 'inputs'){
            node.extras.mapping.input[index][key] = selected['value'];
        }else if(type === 'outputs'){
            node.extras.mapping.output[index][key] = selected['value'];
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
                        this.state.node.extras.mapping.input.length > 0 ?
                            <React.Fragment> 
                                {this.state.node.extras.mapping.input.map((v, i) => {
                                    return <div key={i} className="variable_map mb-2">
                                        <Select
                                            className="map-box"
                                            classNamePrefix="variable-box"
                                            placeholder="Variable"
                                            value={v[Object.keys(v)[0]] !== ''
                                                ? {label: '{' + v[Object.keys(v)[0]] + '}', value: v[Object.keys(v)[0]]}
                                                : null
                                            }
                                            onChange={(select) => this.selectVariable(select, i, 'inputs', Object.keys(v)[0])}
                                            options={Array.isArray(this.props.variables) ? this.props.variables.map(variable => {
                                                return {label: '{' + variable + '}', value: variable }
                                            }) : null}
                                        />
                                        <i className="far fa-arrow-right"/>
                                        <input readOnly className="map-box form-control" value={`{${Object.keys(v)[0]}}`}/>
                                    </div>
                                })}
                            </React.Fragment> 
                            : 
                            <i className="text-muted">No input variables exist for this module</i>
                    }
                </div>
                <hr/>
            </React.Fragment>
        );
    }
}

export default Module;