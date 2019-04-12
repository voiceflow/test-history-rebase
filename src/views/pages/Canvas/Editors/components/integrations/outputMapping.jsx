import React, { Component } from 'react';
import { connect } from 'react-redux'
import Select from 'react-select';
import { openTab } from 'actions/userActions'
import { selectStyles, variableComponent } from 'views/components/VariableSelect'

class OutputMapping extends Component {
    render() {
        return (
            <React.Fragment>
                {this.props.arguments.map((argument, i) => {
                    return (<div key={i} className="super-center mb-2">
                        <div className={'variable_map' + (this.props.reverse ? ' reverse' : '')}>
                            <Select
                                styles={selectStyles}
                                classNamePrefix="select-box"
                                className="integrations-output-box"
                                value={argument.arg1 || null}
                                onChange={(selected) => this.props.handleSelection(i, 'arg1', selected)}
                                placeholder="Column"
                                options={Array.isArray(this.props.arg1_options) ? this.props.arg1_options : null}
                            />
                            <img src={'/arrow-right.svg'} alt="comment" className="mr-2 ml-2" width='7px'/>
                            <Select
                                styles={selectStyles}
                                components={{ Option: variableComponent }}
                                classNamePrefix="variable-box"
                                className="integrations-output-box"
                                value={argument.arg2 ? { label: '{' + argument.arg2 + '}', variable: argument.arg2 } : null}
                                onChange={(selected) => this.props.handleSelection(i, 'arg2', selected.value)}
                                placeholder="Variable"
                                options={Array.isArray(this.props.arg2_options) ? this.props.arg2_options.map((variable, idx) => {
                                    if (idx === this.props.arg2_options.length-1){
                                        return { label: variable, value: variable, openVar: this.props.openVarTab }
                                    }
                                    return { label: '{' + variable + '}', value: variable }
                                }) : null}
                            />
                        </div>
                        <button className="ml-2 close-small" onClick={e => this.props.onRemove(i)}></button>
                    </div>)
                })}
                <button className="btn btn-clear btn-lg btn-block" onClick={this.props.onAdd}>
                    <i className="far fa-plus mr-2"></i> Add Mapping
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


export default connect(null, mapDispatchToProps)(OutputMapping);
