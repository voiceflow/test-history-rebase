import React, { Component } from 'react';
import { connect } from 'react-redux'
import Select from 'react-select';
import { openTab } from 'actions/userActions'

class DiagramVariables extends Component {
    render() {
        return (
            <React.Fragment>
                {this.props.arguments.map((argument, i) => {
                    return (<div key={i} className="super-center mb-2">
                        <div className={'variable_map'  +  (this.props.reverse ? ' reverse' : '')}>
                            <Select
                                classNamePrefix="variable-box"
                                className="map-box"
                                value={argument.arg1 ? {label: '{' + argument.arg1 + '}', variable: argument.arg1} : null}
                                onChange={(selected)=>this.props.handleSelection(i, 'arg1', selected.value)}
                                placeholder={this.props.arg1_options.length > 0 ? "Variable" : "No Var.."}
                                options={Array.isArray(this.props.arg1_options) ? this.props.arg1_options.map(variable => {
                                    return {label: '{' + variable + '}', value: variable}
                                }) : null}
                            />
                            <i className="far fa-arrow-right"/>
                            <Select
                                classNamePrefix="variable-box"
                                className="map-box"
                                value={argument.arg2 ? {label: '{' + argument.arg2 + '}', variable: argument.arg2} : null}
                                onChange={(selected)=>this.props.handleSelection(i, 'arg2', selected.value)}
                                placeholder="Flow Var.."
                                options={Array.isArray(this.props.arg2_options) ? this.props.arg2_options.map(variable => {
                                    return {label: '{' + variable + '}', value: variable}
                                }) : null}
                            />
                        </div>
                        <button className="btn-float" onClick={e => this.props.onRemove(i)}>&times;</button>
                    </div>)
                })}
                <button className="btn btn-clear btn-lg btn-block" onClick={this.props.onAdd}>
                    <i className="far fa-plus mr-1"></i> Add Variable Map
                </button>
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        openVarTab: (tab) => dispatch(openTab(tab)),
    }
}


export default connect(null, mapDispatchToProps)(DiagramVariables);
