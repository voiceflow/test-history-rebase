import React, { Component } from 'react';
import Select from 'react-select';

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
                                value={argument.arg1 ? {label: argument.arg1, variable: argument.arg1} : null}
                                onChange={(selected)=>this.props.handleSelection(i, 'arg1', selected.value)}
                                placeholder={this.props.arg1_options.length > 0 ? "Variable" : "No Variables Exist [!]"}
                                options={Array.isArray(this.props.arg1_options) ? this.props.arg1_options.map(variable => {
                                    return {label: variable, value: variable}
                                }) : null}
                            />
                            <i className="far fa-arrow-right"/>
                            <Select
                                classNamePrefix="new-variable-box"
                                className="map-box"
                                value={argument.arg2 ? {label: argument.arg2, variable: argument.arg2} : null}
                                onChange={(selected)=>this.props.handleSelection(i, 'arg2', selected.value)}
                                placeholder="Flow Variable"
                                options={Array.isArray(this.props.arg2_options) ? this.props.arg2_options.map(variable => {
                                    return {label: variable, value: variable}
                                }) : null}
                            />
                        </div>
                        <div className="close pl-2" onClick={() => this.props.onRemove(i)}>×</div>
                    </div>)
                })}
                <button className="btn btn-default btn-block" onClick={this.props.onAdd}>
                    <i className="far fa-plus"></i> Add Variable Map
                </button>
            </React.Fragment>
        );
    }
}

export default DiagramVariables;
