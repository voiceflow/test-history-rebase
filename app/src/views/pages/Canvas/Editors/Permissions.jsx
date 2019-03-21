import React, { Component } from 'react';
import Permission from './components/Permission'
import { connect } from 'react-redux'
import {Alert} from 'reactstrap'
import { openTab } from "actions/userActions";
const _ = require('lodash')

const permission_options = [
    { name: 'User Email', value: 'alexa::profile:email:read' },
    { name: 'User Name', value: 'alexa::profile:name:read' },
    { name: 'User Phone Number', value: 'alexa::profile:mobile_number:read' },
    { name: 'Reminders', value: 'alexa::alerts:reminders:skill:readwrite' },
    { name: 'Notifications', value: 'alexa::devices:all:notifications:write'},
    { name: 'Account Linking', value: 'UNOFFICIAL::account_linking' },
    { name: 'Product', value: 'UNOFFICIAL::product' }
    // Removed for now, amazon pay permissions broken
]

export class Permissions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: props.node,
            permission_options: permission_options
        };

        this.onUpdate = this.onUpdate.bind(this);
        this.handleAddBlock = this.handleAddBlock.bind(this);
        this.handleRemoveBlock = this.handleRemoveBlock.bind(this);
        this.handleSelectPermission = this.handleSelectPermission.bind(this);
        this.handleSelectVariableToMap = this.handleSelectVariableToMap.bind(this);
    }

    onUpdate(){
        this.setState({
            node: this.state.node
        }, this.props.onUpdate);
    }

    handleAddBlock() {
        var node = this.state.node;
        this.props.clearRedo();
        this.props.updateEvents(_.cloneDeep(node).extras);

        if(node.extras.permissions.length < this.state.permission_options.length){
            let default_selected;

            for (let i = 0; i < this.state.permission_options.length; i++) {
                let permission = this.state.permission_options[i];
                if (!(_.find(_.map(node.extras.permissions, 'selected'), { value: permission.value } ))) {
                    default_selected = {
                        label: permission.name,
                        value: permission.value
                    }
                    break;
                }      
            }

            node.extras.permissions.push({
                selected: default_selected,
                map_to: ''
            });

            this.setState({
                node: node
            }, this.props.onUpdate);
        }
    }

    handleRemoveBlock(i) {
        let node = this.state.node;
        this.props.clearRedo();
        this.props.updateEvents(_.cloneDeep(node).extras);
        
        if(node.extras.permissions.length > 0){
            node.extras.permissions.splice(i, 1);

            this.setState({
                node: node
            }, this.props.onUpdate);
        }
    }

    handleSelectPermission(i, selected) {
        if (selected.value !== 'Create Variable') {
            let node = this.state.node;

            if(node.extras.permissions[i].selected !== selected){
                node.extras.permissions[i].selected = selected

                this.setState({
                    node: node
                }, this.props.onUpdate);
            }
        } else {
            localStorage.setItem(
                "tab",
                "variables"
            );
            this.props.openVarTab("variables");
        }
    }

    handleSelectVariableToMap(i, selected) {
        let node = this.state.node;

        if(node.extras.permissions[i].map_to !== selected){
            node.extras.permissions[i].map_to = selected

            this.setState({
                node: node
            }, this.props.onUpdate);
        }
    }

    handleSelectProductToMap(i, selected) {
        let node = this.state.node;

        if(node.extras.permissions[i].product !== selected){
            node.extras.permissions[i].product = selected

            this.setState({
                node: node
            }, this.props.onUpdate);
        }
    }

    render() {
        return (
            <div className={this.props.live_mode ? 'disabled-overlay' : ''}>
                {this.state.node.extras.permissions.map((perm, i) => {
                    return (
                        <Permission
                            key={i}
                            selected={perm.selected}
                            map_to={perm.map_to}
                            product={perm.product}
                            onRemove={() => this.handleRemoveBlock(i)}
                            selectPermission={(selected) => this.handleSelectPermission(i, selected)}
                            selectVariableToMap={(selected) => this.handleSelectVariableToMap(i, selected)}
                            selectProductToMap={(selected) => this.handleSelectProductToMap(i, selected)}
                            permissions={this.state.permission_options}
                            disabled_perms={this.state.node.extras.permissions}
                            onUpdate={this.onUpdate}
                            variables={this.props.variables}
                        />
                    )
                })}
                { this.state.node.extras.permissions.length < this.state.permission_options.length ?
                    <button className="btn btn-clear btn-lg btn-block" onClick={this.handleAddBlock}>
                        <i className="far fa-plus"></i> Add Permission Request
                    </button> : null
                }
                <Alert className="mt-3">If failing, try prompting the user with the <b>Permission</b> block and a message</Alert>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    live_mode: state.skills.live_mode,
})

const mapDispatchToProps = dispatch => {
    return {
      openVarTab: tab => dispatch(openTab(tab))
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Permissions);
