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
        $('*').keypress(function(e) {
            if ((e.keyCode === 13 || e.which === 13) && e.target.name !== 'inputs') {
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
        }, this.props.onUpdate);
    }

    handleAddChoice(e) {
        var node = this.state.node;
        node.extras.choices.push('New Choice');
        node.extras.inputs.push('');
        node.addOutPort(node.extras.choices.length).setMaximumLinks(1);
        this.setState({
            node: node
        }, this.props.onUpdate);
        $('*').keypress(function(e) {
            if ((e.keyCode === 13 || e.which === 13) && e.target.name !== 'inputs') {
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
        }, this.props.onUpdate);
        e.preventDefault();
    }

    onDrop(files, name) {
        if (files.length > 0) {
            let data = new FormData();
            data.append(name, files[0]);
            $.ajax({
                url: '/audio',
                type: 'POST',
                data: data,
                processData: false,
                contentType: false,
                success: (res) => {
                    let node = this.state.node;
                    node.extras[name] = res;
                    this.setState({
                        node: node
                    }, this.props.onUpdate);
                }
            });
        }
    }

    onClear(name) {
        let node = this.state.node;
        node.extras[name] = '';
        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    onGenerate(text, audio) {
        let node = this.state.node;
        node.extras.audio = '/'+node.extras.text;
        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    render() {
        return (
            <div className='Editor' key={this.state.node.id}>
                <button onClick={this.props.onClose}>&times;</button>
                <form onSubmit={(e) => e.preventDefault()}>

                    <div>
                        <label>Label: <input type="text" name="name" value={this.state.node.name} onChange={this.handleChange.bind(this)} /></label>
                    </div>

                    {this.state.node.extras.type === 'story' ? <div>
                        <label>Title: <input type="text" name="title" value={this.state.node.extras.title} onChange={this.handleChange.bind(this)} /></label>
                        <label>Title Audio: <Dropzone className="dropzone" activeClassName="active" rejectClassName="reject" multiple={false} disableClick={true} accept="audio/*" onDrop={(accepted, rejected) => this.onDrop(accepted, 'audio')}><p>{this.state.node.extras.audio.split('/').pop()}</p></Dropzone><audio key={this.state.node.extras.audio.split('/').pop()} controls><source src={this.state.node.extras.audio} type="audio/mpeg" /></audio><button onClick={() => this.onClear('audio')}>&times;</button><textarea name="audioText" value={this.state.audioText} onChange={this.handleChange.bind(this)} /><button onClick={() => this.onGenerate('audioText', 'audio')}>Generate</button></label>
                        <label>Preview Audio: <Dropzone className="dropzone" activeClassName="active" rejectClassName="reject" multiple={false} disableClick={true} accept="audio/*" onDrop={(accepted, rejected) => this.onDrop(accepted, 'preview')}><p>{this.state.node.extras.preview.split('/').pop()}</p></Dropzone><audio key={this.state.node.extras.preview.split('/').pop()} controls><source src={this.state.node.extras.preview} type="audio/mpeg" /></audio><button onClick={() => this.onClear('preview')}>&times;</button><textarea name="previewText" value={this.state.previewText} onChange={this.handleChange.bind(this)} /><button onClick={() => this.onGenerate('previewText', 'preview')}>Generate</button></label>
                        <label>Reprompt Audio: <Dropzone className="dropzone" activeClassName="active" rejectClassName="reject" multiple={false} disableClick={true} accept="audio/*" onDrop={(accepted, rejected) => this.onDrop(accepted, 'prompt')}><p>{this.state.node.extras.prompt.split('/').pop()}</p></Dropzone><audio key={this.state.node.extras.prompt.split('/').pop()} controls><source src={this.state.node.extras.prompt} type="audio/mpeg" /></audio><button onClick={() => this.onClear('prompt')}>&times;</button><textarea name="promptText" value={this.state.promptText} onChange={this.handleChange.bind(this)} /><button onClick={() => this.onGenerate('promptText', 'prompt')}>Generate</button></label>
                    </div> : null}

                    {this.state.node.extras.type === 'choice' ? <div>
                        <label>Line Audio: <Dropzone className="dropzone" activeClassName="active" rejectClassName="reject" multiple={false} disableClick={true} accept="audio/*" onDrop={(accepted, rejected) => this.onDrop(accepted, 'audio')}><p>{this.state.node.extras.audio.split('/').pop()}</p></Dropzone><audio key={this.state.node.extras.audio.split('/').pop()} controls><source src={this.state.node.extras.audio} type="audio/mpeg" /></audio><button onClick={() => this.onClear('audio')}>&times;</button><textarea name="audioText" value={this.state.audioText} onChange={this.handleChange.bind(this)} /><button onClick={() => this.onGenerate('audioText', 'audio')}>Generate</button></label>
                        <label>Choice Audio: <Dropzone className="dropzone" activeClassName="active" rejectClassName="reject" multiple={false} disableClick={true} accept="audio/*" onDrop={(accepted, rejected) => this.onDrop(accepted, 'prompt')}><p>{this.state.node.extras.prompt.split('/').pop()}</p></Dropzone><audio key={this.state.node.extras.prompt.split('/').pop()} controls><source src={this.state.node.extras.prompt} type="audio/mpeg" /></audio><button onClick={() => this.onClear('prompt')}>&times;</button><textarea name="promptText" value={this.state.promptText} onChange={this.handleChange.bind(this)} /><button onClick={() => this.onGenerate('promptText', 'prompt')}>Generate</button></label>
                        <ChoiceInputs choices={this.state.node.extras.choices} inputs={this.state.node.extras.inputs} onAdd={this.handleAddChoice.bind(this)} onRemove={this.handleRemoveChoice.bind(this)} onChange={this.handleChange.bind(this)} />
                    </div> : null}

                    {this.state.node.extras.type === 'line' ? <div>
                        <label>Line Audio: <Dropzone className="dropzone" activeClassName="active" rejectClassName="reject" multiple={false} disableClick={true} accept="audio/*" onDrop={(accepted, rejected) => this.onDrop(accepted, 'audio')}><p>{this.state.node.extras.audio.split('/').pop()}</p></Dropzone><audio key={this.state.node.extras.audio.split('/').pop()} controls><source src={this.state.node.extras.audio} type="audio/mpeg" /></audio><button onClick={() => this.onClear('audio')}>&times;</button><textarea name="audioText" value={this.state.audioText} onChange={this.handleChange.bind(this)} /><button onClick={() => this.onGenerate('audioText', 'audio')}>Generate</button></label>
                    </div> : null}

                    {this.state.node.extras.type === 'listen' ? <div>
                        <label>Line Audio: <Dropzone className="dropzone" activeClassName="active" rejectClassName="reject" multiple={false} disableClick={true} accept="audio/*" onDrop={(accepted, rejected) => this.onDrop(accepted, 'audio')}><p>{this.state.node.extras.audio.split('/').pop()}</p></Dropzone><audio key={this.state.node.extras.audio.split('/').pop()} controls><source src={this.state.node.extras.audio} type="audio/mpeg" /></audio><button onClick={() => this.onClear('audio')}>&times;</button><textarea name="audioText" value={this.state.audioText} onChange={this.handleChange.bind(this)} /><button onClick={() => this.onGenerate('audioText', 'audio')}>Generate</button></label>
                        <label>Choice Audio: <Dropzone className="dropzone" activeClassName="active" rejectClassName="reject" multiple={false} disableClick={true} accept="audio/*" onDrop={(accepted, rejected) => this.onDrop(accepted, 'prompt')}><p>{this.state.node.extras.prompt.split('/').pop()}</p></Dropzone><audio key={this.state.node.extras.prompt.split('/').pop()} controls><source src={this.state.node.extras.prompt} type="audio/mpeg" /></audio><button onClick={() => this.onClear('prompt')}>&times;</button><textarea name="promptText" value={this.state.promptText} onChange={this.handleChange.bind(this)} /><button onClick={() => this.onGenerate('promptText', 'prompt')}>Generate</button></label>
                    </div> : null}

                    {this.state.node.extras.type === 'retry' ? <div>
                        <label>Retry Audio: <Dropzone className="dropzone" activeClassName="active" rejectClassName="reject" multiple={false} disableClick={true} accept="audio/*" onDrop={(accepted, rejected) => this.onDrop(accepted, 'audio')}><p>{this.state.node.extras.audio.split('/').pop()}</p></Dropzone><audio key={this.state.node.extras.audio.split('/').pop()} controls><source src={this.state.node.extras.audio} type="audio/mpeg" /></audio><button onClick={() => this.onClear('audio')}>&times;</button><textarea name="audioText" value={this.state.audioText} onChange={this.handleChange.bind(this)} /><button onClick={() => this.onGenerate('audioText')}>Generate</button><textarea name="audioText" value={this.state.audioText} onChange={this.handleChange.bind(this)} /><button onClick={() => this.onGenerate('audioText', 'audio')}>Generate</button></label>
                    </div> : null}

                    {this.state.node.extras.type === 'ending' ? <div>
                        <label>Ending Audio: <Dropzone className="dropzone" activeClassName="active" rejectClassName="reject" multiple={false} disableClick={true} accept="audio/*" onDrop={(accepted, rejected) => this.onDrop(accepted, 'audio')}><p>{this.state.node.extras.audio.split('/').pop()}</p></Dropzone><audio key={this.state.node.extras.audio.split('/').pop()} controls><source src={this.state.node.extras.audio} type="audio/mpeg" /></audio><button onClick={() => this.onClear('audio')}>&times;</button><textarea name="audioText" value={this.state.audioText} onChange={this.handleChange.bind(this)} /><button onClick={() => this.onGenerate('audioText', 'audio')}>Generate</button></label>
                    </div> : null}

                </form>
            </div>
        );
    }
}

export default Editor;
