import React, { Component } from 'react';
import { Button, Input, InputGroup, ButtonGroup, InputGroupAddon } from 'reactstrap';
import axios from 'axios';

class FlowButton extends Component {

    constructor(props) {
        super(props);

        this.state = {
            edit: false,
            name: ''
        }

        this.close = this.close.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
          [event.target.name]: event.target.value
        });
    }

    close() {
        if(this.props.flow.name !== this.state.name){
            let old_name = this.props.flow.name;
            this.props.flow.name = this.state.name;

            axios.post(`/diagram/${this.props.flow.id}/name`, {name: this.state.name})
            .then(() => {
                if(this.props.updateTree){
                    this.props.updateTree();
                }
            })
            .catch(err => {
                alert('Error - Name not Updated');
                this.props.flow.name = old_name;
            });
        }

        this.setState({
            edit: false
        });
    }

    render() {

        let active = this.props.active === this.props.flow.id;

        return (
            this.state.edit ? 
                <InputGroup className="diagram-block">
                    <Input 
                        name="name"
                        value={this.state.name}
                        onChange={this.handleChange}
                        autoFocus
                    />
                    <InputGroupAddon addonType="append">
                        <Button className="diagram-edit" 
                                onClick={this.close}>
                            <i className="fas fa-edit"/>
                        </Button> 
                    </InputGroupAddon>
                </InputGroup>
                :
                <ButtonGroup className="diagram-block">
                    <Button disabled={active} 
                        onClick={active ? null : ()=>this.props.enterFlow(this.props.flow.id)} block>
                        <span className="diagram-text">{this.props.flow.name}</span>
                    </Button>
                    { this.props.flow.name !== 'ROOT' ? 
                        <Button className="diagram-edit" 
                            onClick={()=>this.setState({edit: true, name: this.props.flow.name})}>
                            <i className="fas fa-edit"/>
                        </Button> 
                        : null
                    }
                </ButtonGroup>
        );
    }
}

export default FlowButton;
