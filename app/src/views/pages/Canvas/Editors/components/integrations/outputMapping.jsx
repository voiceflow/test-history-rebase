import React from 'react';
import cn from 'classnames'
import { connect } from 'react-redux'
import Select from 'react-select';
import { openTab } from 'actions/userActions'
import { selectStyles, variableComponent } from 'views/components/VariableSelect'

const OutputMapping = (props) => (
    <>
        {props.arguments.map((argument, i) => {
            return (<div key={i} className="super-center mb-2">
                <div className={cn('variable_map', {
                    reverse: props.reverse
                })}>
                    <Select
                        styles={selectStyles}
                        classNamePrefix="select-box"
                        className="integrations-output-box"
                        value={argument.arg1 || null}
                        onChange={(selected) => props.handleSelection(i, 'arg1', selected)}
                        placeholder="Column"
                        options={Array.isArray(props.arg1_options) ? props.arg1_options : null}
                    />
                    <img src={'/arrow-right.svg'} alt="comment" className="mr-2 ml-2" width='7px'/>
                    <Select
                        styles={selectStyles}
                        components={{ Option: variableComponent }}
                        classNamePrefix="variable-box"
                        className="integrations-output-box"
                        value={argument.arg2 ? { label: '{' + argument.arg2 + '}', variable: argument.arg2 } : null}
                        onChange={(selected) => props.handleSelection(i, 'arg2', selected.value)}
                        placeholder="Variable"
                        options={Array.isArray(props.arg2_options) ? props.arg2_options.map((variable, idx) => {
                            if (idx === props.arg2_options.length-1){
                                return { label: variable, value: variable, openVar: props.openVarTab }
                            }
                            return { label: '{' + variable + '}', value: variable }
                        }) : null}
                    />
                </div>
                <button className="ml-2 close-small" onClick={e => props.onRemove(i)}></button>
            </div>)
        })}
        <button className="btn btn-clear btn-lg btn-block" onClick={props.onAdd}>
            <i className="far fa-plus mr-2"></i> Add Mapping
        </button>
    </>
)

const mapDispatchToProps = dispatch => {
    return {
        openVarTab: (tab) => dispatch(openTab(tab)),
    }
}


export default connect(null, mapDispatchToProps)(OutputMapping);
