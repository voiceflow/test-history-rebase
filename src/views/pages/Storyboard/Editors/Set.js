import React, { Component } from 'react';
import { InputGroup, Input, InputGroupAddon, Button, FormGroup, Label } from 'reactstrap';
import Select from 'react-select';
import Expression from './Expression'
import Expressionfy from './Expressionfy';
import isVarName from 'is-var-name';

class SetBlock extends Component {
    constructor(props) {
        super(props);

        let node = this.props.node;

        if(!node.extras.expression || !node.extras.expression.type){
            node.extras.expression = {
                type: 'value',
                value: '',
                depth: 0
            }
        }

        this.state = {
            node: node,
            new_var: ""
        };

        this.addVariable = this.addVariable.bind(this);
        this.deleteVariable = this.deleteVariable.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            node: props.node
        });
    }

    addVariable (){
        let variables = this.props.variables;
        let new_var = this.state.new_var;
        if(isVarName(new_var) && !variables.includes(new_var)){
            variables.unshift(new_var);
            this.props.onVariable(variables);
            this.setState({
                new_var: ""
            })
        }else{
            alert('Invalid Variable: Variables must start with a character and can not contain spaces or special characters');
        }
    }

    deleteVariable(variable){
        let variables = this.props.variables;
        let index = variables.indexOf(variable);
        if (index !== -1) variables.splice(index, 1);
        this.props.onVariable(variables);
    }

    handleChange(event){
        this.setState({
          [event.target.name]: event.target.value
        });
    }

    handleSelection(selected){
        let node = this.state.node;
        node.extras.variable = selected.value;

        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    onUpdate(){
        this.setState({
            node: this.state.node
        }, this.props.onUpdate);
    }

    render() {
        let show = !(this.state.node.extras.expression.type === 'value' || this.state.node.extras.expression.type === 'variable');
        return (
            <div key={this.state.node.id}>
                <div className="variable-group">
                    <span>Set </span>
                    <Select
                        classNamePrefix="variable-box"
                        placeholder={this.props.variables.length > 0 ? "Variable Name" : "No Variables Exist [!]"}
                        className="variable-box"
                        value={this.state.node.extras.variable ? {label: this.state.node.extras.variable, value: this.state.node.extras.variable} : null}
                        onChange={this.handleSelection}
                        options={Array.isArray(this.props.variables) ? this.props.variables.map(variable => {
                            return {label: variable, value: variable}
                        }) : null}
                    />
                    <span> to:</span>
                </div>
                { show ? <Expressionfy expression={this.state.node.extras.expression} />:null}
                <Expression expression={this.state.node.extras.expression} variables={this.props.variables} onUpdate={this.onUpdate}/>
                <hr/>
                <FormGroup className="mb-0">
                    <Label>Add New Variable</Label>
                    <InputGroup>
                        <Input name="new_var" value={this.state.new_var} onChange={this.handleChange} maxLength="16"/>
                        <InputGroupAddon addonType="append"><Button onClick={this.addVariable} className="new_var">Add <i className="fas fa-plus-circle ml-1"/></Button></InputGroupAddon>
                    </InputGroup>
                </FormGroup>
                <h1 className="down-arrow"><i className="fas fa-arrow-down"></i></h1>
                <div>
                    <Label>Variables</Label>
                    <div className="variables">
                        {this.props.variables.length > 0 ? this.props.variables.map(function(variable, i){
                          return <div key={i} className="variable_tag">{variable} <span onClick={() => this.deleteVariable(variable)}><i className="fas fa-times"></i></span></div>
                        }.bind(this)) : <span className="text-muted">No Existing Variables</span>}
                    </div>
                </div>
            </div>
        );
    }
}

export default SetBlock;
