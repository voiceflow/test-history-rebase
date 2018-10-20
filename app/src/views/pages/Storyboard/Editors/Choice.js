import React, { Component } from 'react';
import ChoiceInputs from './ChoiceInputs';
import AudioDrop from './AudioDrop';
import TextVoice from './TextVoice';

class Choice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node,
            voices: Array.isArray(this.props.voices) ? this.props.voices : []
        };
        
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            node: props.node,
            voices: props.voices
        });
    }

    handleChange(e, key = undefined) {
        var node = this.state.node;
        var name = e.target.getAttribute('name');
        var value = e.target.value;
        if (name === 'name') {
            node[name] = value;
        } else if (key !== undefined && (typeof key === 'string' || typeof key === 'number')) {
            node.extras[name][key] = value;
        } else {
            node.extras[name] = value;
        }
        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleAddChoice(e) {
        // console.log(this.state.node.extras.choices);
        var node = this.state.node;
        node.extras.choices.push('New Choice');
        node.extras.inputs.push('');
        let test = node.addOutPort(node.extras.choices.length);
        test.setMaximumLinks(1);

        this.setState({
            node: node
        }, this.props.onUpdate);
        this.props.repaint();
        e.preventDefault();
    }

    handleRemoveChoice(e, i) {
        var node = this.state.node;
        for (var name in node.getPorts()) {
            var port = node.getPort(name);

            if (port.label === node.extras.choices.length) {
                node.removePort(port);
                break;
            }
        }
        node.extras.choices.splice(i, 1);
        node.extras.inputs.splice(i, 1);
        this.setState({
            node: node
        }, this.props.onUpdate);
        this.props.repaint();
        e.preventDefault();
    }

    render() {
        return (
            <div key={this.state.node.id}>
                <div>
                    <label>
                        Choice Audio
                    </label>
                    <AudioDrop
                        audio={this.state.node.extras.prompt}
                        update={(audio) => {
                            let node = this.state.node;
                            node.extras.prompt = audio;
                            this.setState({node: node});
                        }}
                    />
                    <TextVoice
                        text={this.state.node.extras.promptText}
                        voices={this.state.voices}
                        voice={this.state.node.extras.promptVoice}
                        updateText={(e) => {
                            let node = this.state.node;
                            node.extras.promptText = e.target.value;
                            this.setState({node: node});
                        }}
                        updateVoice={(selected) => {
                            let node = this.state.node;
                            node.extras.promptVoice = selected.value;
                            this.setState({node: node});
                        }}
                        updateAudio={(audio) => {
                            let node = this.state.node;
                            node.extras.prompt = audio;
                            this.setState({node: node});
                        }}
                    />
                </div>
                <hr/>
                <div>
                    <label>
                        Choices
                    </label>
                    <ChoiceInputs
                        choices={this.state.node.extras.choices}
                        inputs={this.state.node.extras.inputs}
                        onAdd={this.handleAddChoice.bind(this)}
                        onRemove={this.handleRemoveChoice.bind(this)}
                        onChange={this.handleChange.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

export default Choice;
