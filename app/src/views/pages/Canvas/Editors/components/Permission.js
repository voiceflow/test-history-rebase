import React, { Component } from 'react';
import Select from 'react-select';
const _ = require('lodash')

const PERMISSIONS_WITH_VARIABLE_MAPS = ['User Phone Number', 'User Email', 'User Name']

class Permission extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: props.node,
        };
    }

    render() {
        let VariableLabel =  (props) => {
            if (props.selected && PERMISSIONS_WITH_VARIABLE_MAPS.includes(props.selected.label)) {
                const selected = props.selected.label
                let label;
                if (selected === 'User Phone Number') {
                    label = 'Map User Phone Number To'
                } else if (selected === 'User Email') {
                    label = 'Map User Email To'
                } else if (selected === 'User Name') {
                    label = 'Map User Name To'
                }
                return (
                    <React.Fragment>
                    <label>{label ? label : null}</label>
                        <Select
                            classNamePrefix="variable-box"
                            className="map-box"
                            value={this.props.map_to}
                            onChange={this.props.selectVariableToMap}
                            placeholder={this.props.variables.length > 0 ? "Variable" : "No Variables Exist [!]"}
                            options={Array.isArray(this.props.variables) ? this.props.variables.map(variable => {
                                return {label: '{' + variable + '}', value: variable}
                            }) : null}
                        />
                    </React.Fragment>
                )
            }
            return null
        }
        return (
            <div className="solid-border set-block">
                <div className="close" onClick={this.props.onRemove}>&times;</div>
                <label>Request User Permissions</label>
                <Select
                    classNamePrefix="select-box"
                    value={this.props.selected}
                    onChange={this.props.selectPermission}
                    placeholder='Select User Permission'
                    options={this.props.permissions.map(e => {
                        return {
                            value: e.value, 
                            label: e.name
                        }
                    })}
                    isOptionDisabled={(option) => {
                        if (_.find(this.props.disabled_perms, { selected: option})) {
                            return true
                        }
                        return false
                    }}
                />
                <VariableLabel selected={this.props.selected}/>
            </div>
        );
    }
}

export default Permission;
