import React, { Component } from 'react';
import Select from 'react-select'
import { Label } from 'reactstrap';
import { connect } from 'react-redux'
import { openTab } from 'ducks/user'
import { selectStyles, variableComponent} from 'views/components/VariableSelect'

class Module extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: props.node,
            module: this.props.user_modules.find(m => m.module_id === props.node.extras.module_id)
        }

        this.selectVariable = this.selectVariable.bind(this);
    }

    selectVariable(selected, index, type) {
        if (selected.value !== "Create Variable") {
          let node = this.state.node;

          if (type === "inputs") {
            node.extras.mapping.inputs[index].val = selected["value"];
          } else if (type === "outputs") {
            node.extras.mapping.outputs[index].val = selected["value"];
          }

          this.setState({
            node: node
          });
        } else {
          localStorage.setItem("tab", "variables");
          this.props.openVarTab("variables");
        }
    }

    render() {
        if(!this.state.module){
            return 'Module Not Found (Not In Library)';
        }

        return (
            <React.Fragment>
                <Label>Module Description</Label>
                {this.state.module.descr ? 
                    <div className="module-desc">
                        {this.state.module.descr}
                    </div> : null
                }
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
                                            onChange={(select) => this.selectVariable(select, i, 'inputs')}
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
                <Label>Output Mapping</Label>
                <div>
                {
                    this.state.node.extras.mapping.outputs.length > 0 ?
                        <React.Fragment> 
                            {this.state.node.extras.mapping.outputs.map((v, i) => {
                                return <div key={i} className="variable_map mb-2 reverse">
                                    <Select
                                        className="map-box"
                                        classNamePrefix="variable-box"
                                        placeholder="Variable"
                                        styles={selectStyles}
                                        components={{ Option: variableComponent }}
                                        value={v.val ? {label: '{' + v.val + '}', value: v.val} : null}
                                        onChange={(select) => this.selectVariable(select, i, 'outputs')}
                                        options={Array.isArray(this.props.variables) ? this.props.variables.map((variable, idx) => {
                                            if (idx === this.props.variables.length-1){
                                                return { label: variable, value: variable, openVar: this.props.openVarTab }
                                            }
                                            return { label: '{' + variable + '}', value: variable }
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

const mapDispatchToProps = dispatch => {
    return {
        openVarTab: (tab) => dispatch(openTab(tab)),
    }
}

export default connect(null,mapDispatchToProps)(Module);