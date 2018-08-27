import React, { Component } from 'react';
import { InputGroup, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Select from 'react-select';

class IfBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node,
            new_var: "",
            dropdownOpen: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.setOperation = this.setOperation.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            node: props.node
        });
    }

    toggle() {
        this.setState(prevState => ({
          dropdownOpen: !prevState.dropdownOpen
        }));
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

    setOperation(operation){
        let operations = ["=", "<", ">"];
        if(operations.includes(operation)){
            let node = this.state.node;

            

            this.setState({
                node: node
            }, this.props.onUpdate);
        }
    }

    render() {
        let operator = () => {
            switch(this.state.node.extras.operation) {
                case "=":
                    return <span><i className="fas fa-equals"></i> equals to</span>
                case "<":
                    return <span><i className="fas fa-less-than"></i> smaller than</span>
                case ">":
                    return <span><i className="fas fa-greater-than"></i> greater than</span>
                default:
                    let node = this.state.node;
                    node.extras.operation = "="
                    this.setState({
                        node: node
                    }, this.props.onUpdate);
                    return "= equals"
            }
        }

        return (
            <div key={this.state.node.id}>
                <label>If </label>
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
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle caret className="plain-dropdown">
                      {operator()}
                    </DropdownToggle>
                    <DropdownMenu className="plain-dropdown-menu">
                      <DropdownItem onClick={() => this.setOperation("=")}>= equals to</DropdownItem>
                      <DropdownItem onClick={() => this.setOperation("<")}>{"< smaller than"}</DropdownItem>
                      <DropdownItem onClick={() => this.setOperation(">")}>{"> greater than"}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <InputGroup>
                    <Input placeholder="" />
                </InputGroup>
            </div>
        );
    }
}

export default IfBlock;
