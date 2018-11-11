import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
import DiagramVariables from './components/DiagramVariables';

class Module extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node
        };
        console.log(this.state.node)

        this.handleChange= this.handleChange.bind(this);
    }

    handleChange(e) {
        let node = this.state.node;
        node.extras.commands = e.target.value;
        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    render() {
        return (
            <div>
                <label>Input Variables</label>
                <DiagramVariables
                    arg1_options={this.props.variables}
                    arg2_options={this.state.node.inputs}
                    arguments={this.state.node.extras.inputs}
                    onAdd={() => this.handleAddMap('inputs')}
                    onRemove={(i) => this.handleRemoveMap('inputs', i)}
                    handleSelection={(i, arg, value) => this.handleSelection('inputs', i, arg, value)}
                /> 
                <hr/>
                <label>Output Variables</label>
                <DiagramVariables
                    reverse
                    arg1_options={this.props.variables}
                    arg2_options={this.state.variables}
                    arguments={this.state.node.extras.outputs}
                    onAdd={() => this.handleAddMap('outputs')}
                    onRemove={(i) => this.handleRemoveMap('outputs', i)}
                    handleSelection={(i, arg, value) => this.handleSelection('outputs', i, arg, value)}
                />
            </div>
        );
    }
}

export default Module;