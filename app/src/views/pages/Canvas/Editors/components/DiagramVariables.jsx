import cn from 'classnames'
import React from 'react';
import { connect } from 'react-redux'
import Select from 'react-select';
import { openTab } from 'actions/userActions'

const DiagramVariables = (props) => (
    <>
        {props.arguments.map((argument, i) => {
            return (<div key={i} className="super-center mb-2">
                <div className={cn('variable_map', {
                    reverse: props.reverse
                })}>
                    <Select
                        classNamePrefix="variable-box"
                        className="map-box"
                        value={argument.arg1 ? {label: '{' + argument.arg1 + '}', variable: argument.arg1} : null}
                        onChange={(selected)=>props.handleSelection(i, 'arg1', selected.value)}
                        placeholder={props.arg1_options.length > 0 ? "Variable" : "No Var.."}
                        options={Array.isArray(props.arg1_options) ? props.arg1_options.map(variable => {
                            return {label: '{' + variable + '}', value: variable}
                        }) : null}
                    />
                    <i className="far fa-arrow-right"/>
                    <Select
                        classNamePrefix="variable-box"
                        className="map-box"
                        value={argument.arg2 ? {label: '{' + argument.arg2 + '}', variable: argument.arg2} : null}
                        onChange={(selected)=>props.handleSelection(i, 'arg2', selected.value)}
                        placeholder="Flow Var.."
                        options={Array.isArray(props.arg2_options) ? props.arg2_options.map(variable => {
                            return {label: '{' + variable + '}', value: variable}
                        }) : null}
                    />
                </div>
                <button className="btn-float" onClick={e => props.onRemove(i)}>&times;</button>
            </div>)
        })}
        <button className="btn btn-clear btn-lg btn-block" onClick={props.onAdd}>
            <i className="far fa-plus mr-1"></i> Add Variable Map
        </button>
    </>
)

const mapDispatchToProps = dispatch => {
    return {
        openVarTab: (tab) => dispatch(openTab(tab)),
    }
}


export default connect(null, mapDispatchToProps)(DiagramVariables);
