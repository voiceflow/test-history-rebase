import React, { Component } from 'react';
import $ from 'jquery';
import ChoiceInputs from './ChoiceInputs';

class Editor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node
        };
    }

    componentDidMount() {
        $('.Editor').click(this.props.onFocus);
    }

    componentWillReceiveProps(props) {
        this.setState({
            node: props.node
        });
    }

    handleChange(e, key = undefined) {
        var node = this.state.node;
        if (key !== undefined) {
            node[e.target.getAttribute('name')][key] = e.target.value;
        } else {
            node[e.target.getAttribute('name')] = e.target.value;
        }
        this.setState({
            node: node
        });
        this.props.onUpdate();
    }

    handleAddChoice(e) {
        var node = this.state.node;
        node.sfChoices.push('New Choice');
        node.addOutPort(node.sfChoices.length);
        this.setState({
            node: node
        });
        this.props.onUpdate();
        e.preventDefault();
    }

    handleRemoveChoice(e, i) {
        var node = this.state.node;
        for (var name in node.getPorts()) {
            var port = node.getPort(name);
            if (port.label === node.sfChoices.length) {
                node.removePort(port);
            }
        }
        node.sfChoices.splice(i, 1);
        this.setState({
            node: node
        });
        this.props.onUpdate();
        e.preventDefault();
    }

    render() {
        return (
            <div className='Editor'>
                <button onClick={this.props.onClose}>&times;</button>
                <form onSubmit={(e) => e.preventDefault()}>

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

                    {this.state.node.sfType === 'line' ? <div>
                        <label>Choice Audio: <input type="url" name="sfPrompt" value={this.state.node.sfPrompt} onChange={this.handleChange.bind(this)} /></label>
                    </div> : null}

                    {this.state.node.sfType === 'line' ?
                        <ChoiceInputs choices={this.state.node.sfChoices} onAdd={this.handleAddChoice.bind(this)} onRemove={this.handleRemoveChoice.bind(this)} onChange={this.handleChange.bind(this)} />
                    : null}

                </form>
            </div>
        );
    }
}

export default Editor;
