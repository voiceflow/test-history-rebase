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

    componentWillReceiveProps(props) {
        if(props.node.id !== this.state.node.id){
            this.setState({
                node: props.node
            });
        }
    }

    render() {
        return (
            <div>
                <label>Commands</label>
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
