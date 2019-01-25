import React, { Component } from 'react'
import {Alert} from 'reactstrap'
import Switch from '@material-ui/core/Switch'

const PERMISSIONS = [
    {name: 'Reminders', code: 'alexa::alerts:reminders:skill:readwrite'},
    {name: 'Notifications', code: 'alexa::devices:all:notifications:write'},
    {name: 'Address', code: 'alexa::devices:all:address:full:read'},
    {name: 'Full Name', code: 'alexa::profile:name:read'},
    {name: 'Email', code: 'alexa::profile:email:read'},
    {name: 'Phone', code: 'alexa::profile:mobile_number:read'}
]

class PermissionCard extends Component {
    constructor(props) {
        super(props);

        if(!props.node.extras.permissions){
            props.node.extras.permissions = []
        }

        this.state = {
            node: props.node,
        }

        this.toggle = this.toggle.bind(this)
        this.togglePermission = this.togglePermission.bind(this)
    }

    toggle(field){
        let node = this.state.node
        node.extras[field] = !node.extras[field]
        this.forceUpdate()
    }

    togglePermission(permission){
        let node = this.state.node
        let perm_set = new Set(node.extras.permissions)
        if(perm_set.has(permission)){
            perm_set.delete(permission)
        }else{
            perm_set.add(permission)
        }
        node.extras.permissions = [...perm_set]
        this.forceUpdate()
    }

    render() {
        if(this.state.node.extras.settings){
            return <div>
                <button onClick={()=>this.toggle('settings')} className="btn btn-clear exit"><i className="far fa-chevron-left"/> Back</button>
                <div className="space-between mt-3">
                    <label>Custom Permissions</label>
                    <Switch
                        checked={!!this.state.node.extras.custom}
                        onChange={()=>this.toggle('custom')}
                        color="primary"
                        className="fulfill-switch"
                    />
                </div>
                {this.state.node.extras.custom && <React.Fragment>
                    <hr/>
                    {PERMISSIONS.map(permission => <div className="space-between">
                        <label>{permission.name}</label>
                        <Switch
                            checked={this.state.node.extras.permissions.includes(permission.code)}
                            onChange={()=>this.togglePermission(permission.code)}
                            color="primary"
                            className="fulfill-switch"
                        />
                    </div>)}
                </React.Fragment>}
            </div>
        }
        return (
            <React.Fragment>
                <Alert>Sends permission request to the user's phone/device</Alert>
                <div className="px-5 mt-4">
                    <div className="smartphone">
                        <img src='/images/permissions.png' className="w-100" alt="sample permission"/>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <button className="btn btn-clear" onClick={()=>this.toggle('settings')}>Settings</button>
                </div>
            </React.Fragment>
        );
    }
}

export default PermissionCard;
