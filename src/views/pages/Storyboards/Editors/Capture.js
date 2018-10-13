import React, { Component } from 'react';
import Select from 'react-select';

class Capture extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node
        };

        this.handleSelection = this.handleSelection.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            node: props.node
        });
    }

    handleSelection(selected){
        let node = this.state.node;
        node.extras.variable = selected.value;

        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    render() {
        return (
            <div key={this.state.node.id}>
                <label>Capture Input to: </label>
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
            </div>
        );
    }
}

export default Capture;
