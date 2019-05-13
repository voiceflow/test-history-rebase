import React, { Component } from 'react';
import { connect } from 'react-redux'
import Select from 'react-select';
import { openTab } from "ducks/user";
import { selectStyles, variableComponent } from 'views/components/VariableSelect'
import _ from 'lodash'

const PERMISSIONS_WITH_VARIABLE_MAPS = ['User Phone Number', 'User Email', 'User Name', 'Account Linking']

class Permission extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: props.node,
        };
    }

    render() {
        let variable_map = this.props.selected && PERMISSIONS_WITH_VARIABLE_MAPS.includes(this.props.selected.label)
        let VariableLabel =  () => {
            if (variable_map) {
                const selected = this.props.selected.label
                let label;
                if (selected === 'User Phone Number') {
                    label = 'Map User Phone Number To'
                } else if (selected === 'User Email') {
                    label = 'Map User Email To'
                } else if (selected === 'User Name') {
                    label = 'Map User Name To'
                } else if (selected === 'Account Linking'){
                    label = 'Map Access Token To'
                }
                return (
                    <React.Fragment>
                    <label>{label ? label : null}</label>
                        <Select
                            classNamePrefix="variable-box"
                            className="map-box"
                            styles={selectStyles}
                            components={{ Option: variableComponent }}
                            value={this.props.map_to}
                            onChange={this.props.selectVariableToMap}
                            placeholder={this.props.variables.length > 0 ? "Variable" : "No Variables Exist [!]"}
                            options={Array.isArray(this.props.variables) ? this.props.variables.map((variable, idx) => {
                                if (idx === this.props.variables.length-1){
                                    return { label: variable, value: variable, openVar: this.props.openVarTab }
                                }
                                return { label: '{' + variable + '}', value: variable }
                            }) : null}
                        />
                    </React.Fragment>
                )
            }else if(this.props.selected.label === "Product"){
                let consumable
                if(this.props.product){
                    let product = this.props.products.find(p => p.id === this.props.product.value)
                    if(product && product.data && product.data.type === 'CONSUMABLE'){
                        consumable = true
                    }
                }

                return <React.Fragment>
                    <label>Check if Product Purchased</label>
                    <Select
                        classNamePrefix="select-box"
                        className="map-box"
                        value={this.props.product}
                        onChange={this.props.selectProductToMap}
                        placeholder={this.props.products.length > 0 ? "Select Product" : "No Products Exist"}
                        options={Array.isArray(this.props.products) ? this.props.products.map(p => {
                            return {label: p.name, value: p.id}
                        }) : null}
                    />
                    {this.props.kids && <>
                      <label>(Kids Product) Map Purchase Status To</label>
                    </>}
                    {consumable && <React.Fragment>
                        <label>Map Purchase Quantity To</label>
                        <Select
                            classNamePrefix="variable-box"
                            styles={ selectStyles }
                            components={{Option: variableComponent}}
                            className="map-box"
                            value={this.props.map_to}
                            onChange={this.props.selectVariableToMap}
                            placeholder={this.props.variables.length > 0 ? "Variable" : "No Variables Exist [!]"}
                            options={Array.isArray(this.props.variables) ? this.props.variables.map((variable, idx) => {
                                if (idx === this.props.variables.length - 1) {
                                    return { label: variable, value: variable, openVar: this.props.openVarTab }
                                }
                                return { label: '{' + variable + '}', value: variable }
                            }) : null}
                        />
                    </React.Fragment>}
                </React.Fragment>
            }
            return null
        }
        return (
            <div className="solid-border set-block">
                <div className="close" onClick={this.props.onRemove}></div>
                <label className="mt-0">{variable_map ? 'Request User Information' : 'Check Permission Enabled' }</label>
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
                            if(option.label !== 'Product') return true
                        }
                        return false
                    }}
                />
                <VariableLabel/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
  products: state.products.products,
  kids: state.skills.skill && state.skills.skill.copa
})

const mapDispatchToProps = dispatch => {
    return {
        openVarTab: (tab) => dispatch(openTab(tab)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Permission);
