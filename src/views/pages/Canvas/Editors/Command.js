import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';

class Command extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node
        };

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
                <Textarea
                    value={this.state.node.extras.commands}
                    onChange={this.handleChange}
                    placeholder="eg.&#10;STOP&#10;RESET&#10;RESTART&#10;(new command each line)"
                />
            </div>
        );
    }
}

export default Command;
