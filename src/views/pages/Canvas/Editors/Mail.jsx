import React, { Component } from 'react';
import { connect } from 'react-redux'
import Select from 'react-select'
import { Button, Input, Alert } from 'reactstrap';
import {Link} from 'react-router-dom'

const validateEmail = (email) => {
    var re = /^(([^<>()[]\\.,;:\s@"]+(\.[^<>()[]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export class Mail extends Component {
    constructor(props) {
        super(props);

        let selected;
        if(props.node.extras.template_id){
            let find = props.templates.find(t => t.template_id === props.node.extras.template_id);
            if(find){
                selected = {
                    label: find.title,
                    value: find.template_id,
                    invalid: validateEmail(props.node.extras.to)
                }

                if(props.node.extras.to && props.node.extras.to.length !== 0){
                    props.node.extras.mapping = find.variables.map(v => {
                        let existing = props.node.extras.mapping.find(kv => kv.key === v);
                        let val;
                        if(existing) val = existing.val;
                        return {
                            key: v,
                            val: val
                        }
                    });
                }
            }
        }

        this.state = {
            node: props.node,
            selected: selected
        };

        this.onChange = this.onChange.bind(this);
        this.selectTemplate = this.selectTemplate.bind(this);
        this.selectVariable = this.selectVariable.bind(this);
    }

    onChange(e){
        let node = this.state.node;
        node.extras[e.target.name] = e.target.value;

        if(e.target.name === 'to' && !validateEmail(e.target.value)){
            this.setState({
                invalid: true,
                node: node
            });
        }else{
            this.setState({
                invalid: false,
                node: node
            });
        }
    }

    selectVariable(selected, index) {
        let node = this.state.node;
        if(!node.extras.mapping[index]) return;
        node.extras.mapping[index].val = selected.value;

        this.setState({
            node: node
        });
    }

    selectTemplate(selected) {
        
        if(selected.template_id === this.state.node.extras.template_id) return;

        let find = this.props.templates.find(t => t.template_id === selected.value);
        let node = this.state.node;
        node.extras.template_id = find.template_id;

        if(Array.isArray(find.variables) && find.variables.length !== 0){
            node.extras.mapping = find.variables.map(v => {
                return {
                    val: null,
                    key: v
                }
            })
        }else{
            node.extras.mapping = []
        }

        this.setState({
            selected: selected,
            node: node
        });
    }



    render() {
        if(this.props.templates.length === 0){
            return <div className="text-center">
                <img className="mb-3 mt-5" src={'/images/email_2.svg'} alt="user" width="80"/><br/>
                <span className="text-muted">You currently have no Email Templates</span>
                <Link className="btn btn-secondary mt-3" to={`/business/${this.props.skill_id}/emails`}>Add Templates</Link> 
            </div>
        }

        let user = this.state.node.extras.to === '_USER';

        return (
            <div>
                <label>Email Template</label>
                <Select
                    classNamePrefix="select-box"
                    value={this.state.selected}
                    onChange={this.selectTemplate}
                    placeholder='Select Email Template'
                    options={this.props.templates.map(t => {return {
                        value: t.template_id,
                        label: t.title
                    }})}
                />
                <hr/>
                <div className="label-btns">
                    <label>To</label>
                    <Button outline={!user} disabled={user} color="primary" onClick={()=>{
                        let node = this.state.node;
                        if(node.extras.to === '_USER') return;
                        node.extras.to = '_USER';
                        this.setState({node: node});
                    }}>User Email</Button>
                    <Button outline={user} disabled={!user} color="primary" onClick={()=>{
                        let node = this.state.node;
                        if(node.extras.to !== '_USER') return;
                        node.extras.to = '';
                        this.setState({node: node});
                    }}>Defined</Button>
                </div>
                {
                    !user ? 
                    <React.Fragment>
                        <Input 
                            className="form-bg"
                            name='to'
                            type='email'
                            value={this.state.node.extras.to} 
                            onChange={this.onChange}
                            placeholder="E-mail"
                        />
                        {this.state.invalid && <Alert color="danger" className="py-1 px-2 mt-1">Invalid Email</Alert>}
                    </React.Fragment> :
                    <span className="text-muted font-italic">
                        This Message Will Only Be Sent If the User Consents to Sharing Their Email
                    </span>
                }
                <hr/>
                <label>Email Variable Map</label>
                <div>
                {
                    this.state.node.extras.mapping.length !== 0 ?
                        <React.Fragment> 
                            {this.state.node.extras.mapping.map((v, i) => {
                                return <div key={i} className="variable_map mb-2">
                                    <Select
                                        className="map-box"
                                        classNamePrefix="variable-box"
                                        placeholder="Variable"
                                        value={v.val ? {label: '{' + v.val + '}', value: v.val} : null}
                                        onChange={(select) => this.selectVariable(select, i)}
                                        options={Array.isArray(this.props.variables) ? this.props.variables.map(variable => {
                                            return {label: '{' + variable + '}', value: variable }
                                        }) : null}
                                    />
                                    <i className="far fa-arrow-right"/>
                                    <input readOnly className="map-box form-control" value={`{${v.key}}`}/>
                                </div>
                            })}
                        </React.Fragment> : <i className="text-muted">No Variables Exist For This Email</i>
                }
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    skill_id: state.skills.skill.skill_id,
    templates: state.emails.email_templates,
})

export default connect(mapStateToProps)(Mail);
