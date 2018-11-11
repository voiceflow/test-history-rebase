import React, { Component } from 'react';
import Select from 'react-select'
import { Button, Input } from 'reactstrap';

class Mail extends Component {
    constructor(props) {
        super(props);

        let selected;
        if(props.node.extras.template_id){
            let find = props.templates.find(t => t.template_id === props.node.extras.template_id);
            if(find){
                selected = {
                    label: find.title,
                    value: find.template_id
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
        this.setState({
            [e.target.name]: e.target.value,
            saved: false
        });
    }

    selectVariable(selected, index) {
        let node = this.state.node;
        if(!node.extras.mapping[index]) return;
        node.extras.mapping[index].input = selected.value;

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
                    input: null,
                    output: v
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
            return 'No Email Templates Exist. Add them in Business > Email'
        }

        let user = this.state.node.extras.to === 'USER';

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
                    <Button outline={user} disabled={!user} color="primary">User Email</Button>
                    <Button outline={!user} disabled={user} color="primary">Defined</Button>
                </div>
                {
                    user ? 
                    <Input 
                        name='to' 
                        value={this.state.node.extras.to} 
                        onChange={this.onChange}
                        placeholder="E-mail"
                    /> :
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
                                        value={v.input ? {label: '{' + v.input + '}', value: v.input} : null}
                                        onChange={(select) => this.selectVariable(select, i)}
                                        options={Array.isArray(this.props.variables) ? this.props.variables.map(variable => {
                                            return {label: '{' + variable + '}', value: variable }
                                        }) : null}
                                    />
                                    <i className="far fa-arrow-right"/>
                                    <input readOnly className="map-box form-control" value={`{${v.output}}`}/>
                                </div>
                            })}
                        </React.Fragment> : <i className="text-muted">No Variables Exist For This Email</i>
                }
                </div>
            </div>
        );
    }
}

export default Mail;
