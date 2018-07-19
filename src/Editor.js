import React, { Component } from 'react';
import $ from 'jquery';
import ChoiceInputs from './ChoiceInputs';
import Dropzone from 'react-dropzone';

class Editor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node
        };
    }

    componentDidMount() {
        $('.Editor').click(this.props.onFocus);
        $('input, button').keypress(function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
            }
        });
    }

    componentWillReceiveProps(props) {
        this.setState({
            node: props.node
        });
    }

    handleChange(e, key = undefined) {
        var node = this.state.node;
        var name = e.target.getAttribute('name');
        var value = e.target.value;
        if (name === 'name') {
            node[name] = value;
        } else if (key !== undefined) {
            node.extras[name][key] = value;
        } else {
            node.extras[name] = value;
        }
        this.setState({
            node: node
        });
        this.props.onUpdate();
    }

    handleAddChoice(e) {
        var node = this.state.node;
        node.extras.choices.push('New Choice');
        node.extras.inputs.push('');
        node.addOutPort(node.extras.choices.length).setMaximumLinks(1);
        this.setState({
            node: node
        });
        this.props.onUpdate();
        $('input, button').keypress(function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
            }
        });
        e.preventDefault();
    }

    handleRemoveChoice(e, i) {
        var node = this.state.node;
        for (var name in node.getPorts()) {
            var port = node.getPort(name);
            if (port.label === node.extras.choices.length) {
                node.removePort(port);
            }
        }
        node.extras.choices.splice(i, 1);
        node.extras.inputs.splice(i, 1);
        this.setState({
            node: node
        });
        this.props.onUpdate();
        e.preventDefault();
    }

    onDrop(files, name) {
        if (files.length > 0) {
            let data = new FormData();
            data.append(name, files[0]);
            $.ajax({
                url: 'https://api.getstoryflow.com/audio',
                type: 'POST',
                data: data,
                processData: false,
                contentType: false,
                success: (res) => {
                    let node = this.state.node;
                    node.extras.audio = res;
                    this.setState({
                        node: node
                    });
                    this.props.onUpdate();
                }
            });
        }
    }

    render() {
        return (
            <div className='Editor'>
                <button onClick={this.props.onClose}>&times;</button>
                <form onSubmit={(e) => e.preventDefault()}>

                    <div>
                        <label>Label: <input type="text" name="name" value={this.state.node.name} onChange={this.handleChange.bind(this)} /></label>
                    </div>

                    {this.state.node.extras.type === 'story' ? <div>
                        <label>Title: <input type="text" name="title" value={this.state.node.extras.title} onChange={this.handleChange.bind(this)} /></label>
                        <label>Title Audio: <input type="url" name="audio" value={this.state.node.extras.audio} onChange={this.handleChange.bind(this)} /></label>
                        <label>Title Audio: <Dropzone accept="audio/*" onDrop={(accepted, rejected) => this.onDrop(accepted, 'audio')}><p>{this.state.node.extras.audio}</p></Dropzone></label>
                        <label>Reprompt Audio: <input type="url" name="prompt" value={this.state.node.extras.prompt} onChange={this.handleChange.bind(this)} /></label>
                        <label>Ending Audio: <input type="url" name="ending" value={this.state.node.extras.ending} onChange={this.handleChange.bind(this)} /></label>
                    </div> : null}

                    {this.state.node.extras.type === 'chapter' ? <div>
                        <label>Chapter Audio: <input type="url" name="audio" value={this.state.node.extras.audio} onChange={this.handleChange.bind(this)} /></label>
                        <label>Chapter Prompt: <input type="url" name="prompt" value={this.state.node.extras.prompt} onChange={this.handleChange.bind(this)} /></label>
                        <label>Chapter Number: <input type="number" name="number" value={this.state.node.extras.number} onChange={this.handleChange.bind(this)} /></label>
                    </div> : null}

                    {this.state.node.extras.type === 'choice' ? <div>
                        <label>Line Audio: <input type="url" name="audio" value={this.state.node.extras.audio} onChange={this.handleChange.bind(this)} /></label>
                        <label>Choice Audio: <input type="url" name="prompt" value={this.state.node.extras.prompt} onChange={this.handleChange.bind(this)} /></label>
                        <ChoiceInputs choices={this.state.node.extras.choices} inputs={this.state.node.extras.inputs} onAdd={this.handleAddChoice.bind(this)} onRemove={this.handleRemoveChoice.bind(this)} onChange={this.handleChange.bind(this)} />
                    </div> : null}

                    {this.state.node.extras.type === 'line' ? <div>
                        <label>Line Audio: <input type="url" name="audio" value={this.state.node.extras.audio} onChange={this.handleChange.bind(this)} /></label>
                    </div> : null}

                    {this.state.node.extras.type === 'listen' ? <div>
                        <label>Line Audio: <input type="url" name="audio" value={this.state.node.extras.audio} onChange={this.handleChange.bind(this)} /></label>
                        <label>Choice Audio: <input type="url" name="prompt" value={this.state.node.extras.prompt} onChange={this.handleChange.bind(this)} /></label>
                    </div> : null}

                    {this.state.node.extras.type === 'ending' ? <div>
                        <label>Ending Audio: <input type="url" name="audio" value={this.state.node.extras.audio} onChange={this.handleChange.bind(this)} /></label>
                        <label>Ending Prompt: <input type="url" name="prompt" value={this.state.node.extras.prompt} onChange={this.handleChange.bind(this)} /></label>
                    </div> : null}

                </form>
            </div>
        );
    }
}

export default Editor;
