import cn from 'classnames'
import React from 'react';
import Select from 'react-select';

import Button from 'components/Button'
import { selectStyles, variableComponent } from 'views/components/VariableSelect'

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
                        styles={selectStyles}
                        components={{ Option: variableComponent }}
                        value={argument.arg1 ? {label: '{' + argument.arg1 + '}', variable: argument.arg1} : null}
                        onChange={(selected) => {
                            if (selected.value !== 'Create Variable') props.handleSelection(i, 'arg1', selected.value) 
                        }}
                        placeholder={props.arg1_options.length > 0 ? "Variable" : "No Var.."}
                        options={Array.isArray(props.arg1_options) ? props.arg1_options.map((variable, idx) => {
                            if (idx === props.arg1_options.length-1){
                                return { label: variable, value: variable, openVar: props.openVarTab }
                            }
                            return { label: '{' + variable + '}', value: variable }
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
                <Button isFloat onClick={e => props.onRemove(i)}>&times;</Button>
            </div>)
        })}
        <Button isBtn isClear isLarge isBlock onClick={props.onAdd}>
            <i className="far fa-plus mr-1"></i> Add Variable Map
        </Button>
    </>
)

export default DiagramVariables;