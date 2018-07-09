import React, { Component } from 'react';
import ChoiceInputs from './ChoiceInputs';

class Editor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            node: props.node
        });
    }

    handleChange(event, key = null) {
        var node = this.state.node;
        if (key !== null) {
            node[event.target.getAttribute('name')][key] = event.target.value;
        } else {
            node[event.target.getAttribute('name')] = event.target.value;
        }
        this.setState({
            node: node
        });
        this.props.onUpdate();
    }

    handleAddChoice() {
        var node = this.state.node;
        node.sfChoices.push('New Choice');
        node.addOutPort(node.sfChoices[node.sfChoices.length-1]);
        this.setState({
            node: node
        });
        this.props.onUpdate();
    }

    render() {
        return (
            <div className='Editor'>
                <button onClick={this.props.onClose}>&times;</button>
                <form onSubmit={(event) => event.preventDefault()}>

                    <div>
                        <label>Label: <input type="text" name="name" value={this.state.node.name} onChange={this.handleChange.bind(this)} /></label>
                    </div>

                    {this.state.node.sfType === 'story' ? <div>
                        <label>Title: <input type="text" name="sfTitle" value={this.state.node.sfTitle} onChange={this.handleChange.bind(this)} /></label>
                    </div> : null}

                    {this.state.node.sfType === 'story' ? <div>
                        <label>Title Audio: <input type="url" name="sfAudio" value={this.state.node.sfAudio} onChange={this.handleChange.bind(this)} /></label>
                    </div> : null}

                    {this.state.node.sfType === 'line' ? <div>
                        <label>Line Audio: <input type="url" name="sfAudio" value={this.state.node.sfAudio} onChange={this.handleChange.bind(this)} /></label>
                    </div> : null}

                    {this.state.node.sfType === 'choice' ?
                        <ChoiceInputs choices={this.state.node.sfChoices} onAdd={this.handleAddChoice.bind(this)} onChange={this.handleChange.bind(this)} />
                    : null}

                </form>
            </div>
        );
    }
}

export default Editor;
