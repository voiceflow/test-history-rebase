import React, { Component } from 'react';
import {Dropdown, Input, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import { connect } from "react-redux";
import Select from 'react-select';
import { openTab } from 'actions/userActions'
import { selectStyles, variableComponent } from 'views/components/VariableSelect'
import './Expression.css'

import { symbols, groups } from './Expression.config'

// logic type that allows for arithmatic
// const arithmatic = groups[1]

class Expression extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expression: this.props.expression,
            dropdownOpen: false
        }

        this.handleValue = this.handleValue.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleType = this.handleType.bind(this);
        this.toggleDropDown = this.toggleDropDown.bind(this);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            expression: nextProps.expression
        });
    }

    handleValue(event) {
        let expression = this.state.expression;
        expression.value = event.target.value;

        this.setState({
            expression: expression
        }, this.props.onUpdate);
    }

    toggleDropDown() {
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        });
    }

    handleType(type) {
        let expression = this.state.expression;
        let depth = this.state.expression.depth + 1;

        if(type === expression.type) return;

        let og_type = expression.type;
        expression.type = type;

        switch(expression.type){
            case 'value':
                expression.value = '';
                break;
            case 'variable':
                expression.value = null;
                break;
            case 'not':
                if(og_type === 'value'){
                    expression.value = {
                        type: 'value',
                        value: expression.value,
                        depth: depth
                    }
                }else if(og_type === 'variable'){
                    expression.value = {
                        type: 'variable',
                        value: expression.value,
                        depth: depth
                    }
                }else{
                    expression.value = {
                        type: expression.value[0].type,
                        value: expression.value[0].value,
                        depth: depth
                    }
                }
                break;
            default:
                if(Array.isArray(expression.value)){
                    // do nothing since its already 2 type value
                }else if(og_type === 'value'){
                    expression.value = [{
                        type: 'value',
                        value: expression.value,
                        depth: depth
                    }, {
                        type: 'value',
                        value: '',
                        depth: depth
                    }];
                }else if(og_type === 'variable'){
                    expression.value = [{
                        type: 'variable',
                        value: expression.value,
                        depth: depth
                    }, {
                        type: 'value',
                        value: '',
                        depth: depth
                    }];
                }else{
                    expression.value = [{
                        type: 'value',
                        value: '',
                        depth: depth
                    }, {
                        type: 'value',
                        value: '',
                        depth: depth
                    }];
                }
        }

        this.setState({
            expression: expression
        }, this.props.onUpdate);
    }

    handleSelection(selected){
        if (selected.value !== 'Create Variable') {
            let expression = this.state.expression;
            expression.value = selected.value;

            this.setState({
                expression: expression
            }, this.props.onUpdate);
        } else {
            localStorage.setItem(
                "tab",
                "variables"
            );
            this.props.openVarTab("variables");
        }
    }

    render() {
        if(!this.state.expression || !this.state.expression.type) return null;

        let render = null;

        let type = this.state.expression.type;

        let dropdown = this.state.expression.depth < 8 ? 
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
            <DropdownToggle className="type-button">
                <i className="fas fa-code"/>
            </DropdownToggle>      
            <DropdownMenu>
                {groups.map((group, i) => {
                    return <div key={i}> {
                        group.map(type => {
                            return <DropdownItem key={type} onClick={() => this.handleType(type)}>{symbols[type]}</DropdownItem>
                        })}
                        { (i !== (groups.length - 1)) ? <DropdownItem divider /> : null}
                    </div>
                })}
            </DropdownMenu>
        </Dropdown> : null;

        switch(type){
            case 'variable':
                render = 
                    <div className="d-flex">
                        <Select
                            classNamePrefix="variable-box"
                            styles={selectStyles}
                            placeholder={this.props.variables.length > 0 ? "Variable Name" : "No Variables Exist [!]"}
                            className="variable-box"
                            components={{Option: variableComponent}}
                            value={this.state.expression.value ? {label: '{' + this.state.expression.value + '}', value: this.state.expression.value} : null}
                            onChange={this.handleSelection}
                            options={Array.isArray(this.props.variables) ? this.props.variables.map((variable, idx) => {
                                if (idx === this.props.variables.length-1){
                                    return { label: variable, value: variable, openVar: this.props.openVarTab }
                                }
                                return { label: '{' + variable + '}', value: variable }
                            }) : null}
                        />
                        {dropdown}
                    </div>
                break;

            case 'value':
                render = 
                    <div className="d-flex">
                        <Input placeholder="value" value={this.state.expression.value} onChange={this.handleValue}/>
                        {dropdown}
                    </div>
                break;
            case 'not':
                render = 
                <div className={'expression-block ' + type}>
                    <div className="operator">{symbols[type]}{dropdown}</div>
                    <Expression expression={this.state.expression.value} variables={this.props.variables} onUpdate={this.props.onUpdate}/>
                </div>
                break;
            default:
                render = 
                    <div className={'expression-block ' + type}>
                        <Expression expression={this.state.expression.value[0]} openVarTab={this.props.openVarTab} variables={this.props.variables} onUpdate={this.props.onUpdate}/>
                        <div className="operator">{symbols[type]}{dropdown}</div>
                        <Expression expression={this.state.expression.value[1]} openVarTab={this.props.openVarTab} variables={this.props.variables} onUpdate={this.props.onUpdate}/>
                    </div>
        }

        return render;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        openVarTab: (tab) => dispatch(openTab(tab)),
    }
}

export default connect(null, mapDispatchToProps)(Expression);
