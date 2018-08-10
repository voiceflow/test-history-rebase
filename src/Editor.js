import React, { Component } from 'react';
import $ from 'jquery';
import ChoiceInputs from './ChoiceInputs';
import Dropzone from 'react-dropzone';

class Editor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node,
            voices: []
        };
    }

    componentDidMount() {
        $('*').keypress(function(e) {
            if ((e.keyCode === 13 || e.which === 13) && e.target.name !== 'inputs' && !e.target.name.endsWith('Text')) {
                e.preventDefault();
            }
        });
        $.ajax({
            url: '/voices',
            type: 'GET',
            success: res => {
                this.setState({
                    voices: res
                });
            },
            error: () => {window.alert('Error');}
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
            if ((e.keyCode === 13 || e.which === 13) && e.target.name !== 'inputs' && !e.target.name.endsWith('Text')) {
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
            let node = this.state.node;
            let data = new FormData();
            data.append(name, files[0]);
            $.ajax({
                url: '/audio',
                type: 'POST',
                data: data,
                processData: false,
                contentType: false,
                success: res => {
                    node.extras[name] = res;
                    this.setState({
                        node: node
                    }, this.props.onUpdate);
                },
                error: () => {window.alert('Error');}
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

    onEffect(name, effect) {
        var textArea = $("[name='"+name+"']")[0];
        var start = textArea.selectionStart;
        var end = textArea.selectionEnd;
        var text = this.state.node.extras[name];

        var result = null;

        if (effect === 'break') {
            result = text.substring(0, start)+text.substring(start, end)+'<break />'+text.substring(end, text.length);
        }

        var state = {};
        state[name] = result;
        this.setState(state);
    }

    onGenerate(text, voice, audio) {
        let node = this.state.node;
        $.ajax({
            url: '/generate',
            type: 'POST',
            data: {
                text: node.extras[text],
                voice: node.extras[voice]
            },
            success: res => {
                node.extras[audio] = res;
                this.setState({
                    node: node
                }, this.props.onUpdate);
            },
            error: () => {window.alert('Error');}
        });
    }

    render() {
        return (
            <div className='Editor' key={this.state.node.id}>
                <button onClick={this.props.onClose}>&times;</button>
                <form onSubmit={(e) => e.preventDefault()}>

                    <div>
                        <label>
                            Label:
                            <input
                                type="text"
                                name="name"
                                value={this.state.node.name}
                                onChange={this.handleChange.bind(this)}
                            />
                        </label>
                    </div>

                    {this.state.node.extras.type === 'story' ? <div>
                        <label>
                            Title:
                            <input
                                type="text"
                                name="title"
                                value={this.state.node.extras.title}
                                onChange={this.handleChange.bind(this)}
                            />
                        </label>
                        <label>
                            Title Audio:
                            <Dropzone
                                className="dropzone"
                                activeClassName="active"
                                rejectClassName="reject"
                                multiple={false}
                                disableClick={true}
                                accept="audio/*"
                                onDrop={(accepted, rejected) => this.onDrop(accepted, 'audio')}
                            >
                                <p>{this.state.node.extras.audio.split('/').pop()}</p>
                            </Dropzone>
                            <audio key={this.state.node.extras.audio.split('/').pop()} controls>
                                <source src={this.state.node.extras.audio} type="audio/mpeg" />
                            </audio>
                            <button className="clear" onClick={() => this.onClear('audio')}>Clear</button>
                            <textarea
                                name="audioText"
                                value={this.state.node.extras.audioText}
                                onChange={this.handleChange.bind(this)}
                            />
                            <select
                                name="audioVoice"
                                value={this.state.node.extras.audioVoice}
                                onChange={this.handleChange.bind(this)}
                            >
                                <option value="" selected disabled hidden>Choose Voice</option>
                                {Array.isArray(this.state.voices) ? this.state.voices.map(voice => {
                                    return <option key={voice.Id} value={voice.Id}>{voice.Name}</option>;
                                }) : null}
                            </select>
                            <button onClick={() => this.onEffect('audioText', 'break')}>Break</button>
                            <button onClick={() =>
                                this.onGenerate('audioText', 'audioVoice', 'audio')}
                            >
                                Generate
                            </button>
                        </label>
                        <label>
                            Preview Audio:
                            <Dropzone
                                className="dropzone"
                                activeClassName="active"
                                rejectClassName="reject"
                                multiple={false}
                                disableClick={true}
                                accept="audio/*"
                                onDrop={(accepted, rejected) => this.onDrop(accepted, 'preview')}
                            >
                                <p>{this.state.node.extras.preview.split('/').pop()}</p>
                            </Dropzone>
                            <audio key={this.state.node.extras.preview.split('/').pop()} controls>
                                <source src={this.state.node.extras.preview} type="audio/mpeg" />
                            </audio>
                            <button className="clear" onClick={() => this.onClear('preview')}>Clear</button>
                            <textarea
                                name="previewText"
                                value={this.state.node.extras.previewText}
                                onChange={this.handleChange.bind(this)}
                            />
                            <select
                                name="previewVoice"
                                value={this.state.node.extras.previewVoice}
                                onChange={this.handleChange.bind(this)}
                            >
                                <option value="" selected disabled hidden>Choose Voice</option>
                                {Array.isArray(this.state.voices) ? this.state.voices.map(voice => {
                                    return <option key={voice.Id} value={voice.Id}>{voice.Name}</option>;
                                }) : null}
                            </select>
                            <button onClick={() =>
                                this.onGenerate('previewText', 'previewVoice', 'preview')}
                            >
                                    Generate
                            </button>
                        </label>
                        <label>
                            Reprompt Audio:
                            <Dropzone
                                className="dropzone"
                                activeClassName="active"
                                rejectClassName="reject"
                                multiple={false}
                                disableClick={true}
                                accept="audio/*"
                                onDrop={(accepted, rejected) => this.onDrop(accepted, 'prompt')}
                            >
                                <p>{this.state.node.extras.prompt.split('/').pop()}</p>
                            </Dropzone>
                            <audio key={this.state.node.extras.prompt.split('/').pop()} controls>
                                <source src={this.state.node.extras.prompt} type="audio/mpeg" />
                            </audio>
                            <button className="clear" onClick={() => this.onClear('prompt')}>Clear</button>
                            <textarea
                                name="promptText"
                                value={this.state.node.extras.promptText}
                                onChange={this.handleChange.bind(this)}
                            />
                            <select
                                name="promptVoice"
                                value={this.state.node.extras.promptVoice}
                                onChange={this.handleChange.bind(this)}
                            >
                                <option value="" selected disabled hidden>Choose Voice</option>
                                {Array.isArray(this.state.voices) ? this.state.voices.map(voice => {
                                    return <option key={voice.Id} value={voice.Id}>{voice.Name}</option>;
                                }) : null}
                            </select>
                            <button onClick={() =>
                                this.onGenerate('promptText', 'promptVoice', 'prompt')}
                            >
                                Generate
                            </button>
                        </label>
                    </div> : null}

                    {this.state.node.extras.type === 'choice' ? <div>
                        <label>
                            Line Audio:
                            <Dropzone
                                className="dropzone"
                                activeClassName="active"
                                rejectClassName="reject"
                                multiple={false}
                                disableClick={true}
                                accept="audio/*"
                                onDrop={(accepted, rejected) => this.onDrop(accepted, 'audio')}
                            >
                                <p>{this.state.node.extras.audio.split('/').pop()}</p>
                            </Dropzone>
                            <audio key={this.state.node.extras.audio.split('/').pop()} controls>
                                <source src={this.state.node.extras.audio} type="audio/mpeg" />
                            </audio>
                            <button className="clear" onClick={() => this.onClear('audio')}>Clear</button>
                            <textarea
                                name="audioText"
                                value={this.state.node.extras.audioText}
                                onChange={this.handleChange.bind(this)}
                            />
                            <select
                                name="audioVoice"
                                value={this.state.node.extras.audioVoice}
                                onChange={this.handleChange.bind(this)}
                            >
                                <option value="" selected disabled hidden>Choose Voice</option>
                                {Array.isArray(this.state.voices) ? this.state.voices.map(voice => {
                                    return <option key={voice.Id} value={voice.Id}>{voice.Name}</option>;
                                }) : null}
                            </select>
                            <button onClick={() =>
                                this.onGenerate('audioText', 'audioVoice', 'audio')}
                            >
                                Generate
                            </button>
                        </label>
                        <label>
                            Choice Audio:
                            <Dropzone
                                className="dropzone"
                                activeClassName="active"
                                rejectClassName="reject"
                                multiple={false}
                                disableClick={true}
                                accept="audio/*"
                                onDrop={(accepted, rejected) => this.onDrop(accepted, 'prompt')}
                            >
                                <p>{this.state.node.extras.prompt.split('/').pop()}</p>
                            </Dropzone>
                            <audio key={this.state.node.extras.prompt.split('/').pop()} controls>
                                <source src={this.state.node.extras.prompt} type="audio/mpeg" />
                            </audio>
                            <button className="clear" onClick={() => this.onClear('prompt')}>Clear</button>
                            <textarea
                                name="promptText"
                                value={this.state.node.extras.promptText}
                                onChange={this.handleChange.bind(this)}
                            />
                            <select
                                name="promptVoice"
                                value={this.state.node.extras.promptVoice}
                                onChange={this.handleChange.bind(this)}
                            >
                                <option value="" selected disabled hidden>Choose Voice</option>
                                {Array.isArray(this.state.voices) ? this.state.voices.map(voice => {
                                    return <option key={voice.Id} value={voice.Id}>{voice.Name}</option>;
                                }) : null}
                            </select>
                            <button onClick={() =>
                                this.onGenerate('promptText', 'promptVoice', 'prompt')}
                            >
                                Generate
                            </button>
                        </label>
                        <ChoiceInputs
                            choices={this.state.node.extras.choices}
                            inputs={this.state.node.extras.inputs}
                            onAdd={this.handleAddChoice.bind(this)}
                            onRemove={this.handleRemoveChoice.bind(this)}
                            onChange={this.handleChange.bind(this)}
                        />
                    </div> : null}

                    {this.state.node.extras.type === 'line' ? <div>
                        <label>
                            Line Audio:
                            <Dropzone
                                className="dropzone"
                                activeClassName="active"
                                rejectClassName="reject"
                                multiple={false}
                                disableClick={true}
                                accept="audio/*"
                                onDrop={(accepted, rejected) => this.onDrop(accepted, 'audio')}
                            >
                                <p>{this.state.node.extras.audio.split('/').pop()}</p>
                            </Dropzone>
                            <audio key={this.state.node.extras.audio.split('/').pop()} controls>
                                <source src={this.state.node.extras.audio} type="audio/mpeg" />
                            </audio>
                            <button className="clear" onClick={() => this.onClear('audio')}>Clear</button>
                            <textarea
                                name="audioText"
                                value={this.state.node.extras.audioText}
                                onChange={this.handleChange.bind(this)}
                            />
                            <select
                                name="audioVoice"
                                value={this.state.node.extras.audioVoice}
                                onChange={this.handleChange.bind(this)}
                            >
                                <option value="" selected disabled hidden>Choose Voice</option>
                                {Array.isArray(this.state.voices) ? this.state.voices.map(voice => {
                                    return <option key={voice.Id} value={voice.Id}>{voice.Name}</option>;
                                }) : null}
                            </select>
                            <button onClick={() =>
                                this.onGenerate('audioText', 'audioVoice', 'audio')}
                            >
                                Generate
                            </button>
                        </label>
                    </div> : null}

                    {this.state.node.extras.type === 'listen' ? <div>
                        <label>
                            Line Audio:
                            <Dropzone
                                className="dropzone"
                                activeClassName="active"
                                rejectClassName="reject"
                                multiple={false}
                                disableClick={true}
                                accept="audio/*"
                                onDrop={(accepted, rejected) => this.onDrop(accepted, 'audio')}
                            >
                                <p>{this.state.node.extras.audio.split('/').pop()}</p>
                            </Dropzone>
                            <audio key={this.state.node.extras.audio.split('/').pop()} controls>
                                <source src={this.state.node.extras.audio} type="audio/mpeg" />
                            </audio>
                            <button className="clear" onClick={() => this.onClear('audio')}>Clear</button>
                            <textarea
                                name="audioText"
                                value={this.state.node.extras.audioText}
                                onChange={this.handleChange.bind(this)}
                            />
                            <select
                                name="audioVoice"
                                value={this.state.node.extras.audioVoice}
                                onChange={this.handleChange.bind(this)}
                            >
                                <option value="" selected disabled hidden>Choose Voice</option>
                                {Array.isArray(this.state.voices) ? this.state.voices.map(voice => {
                                    return <option key={voice.Id} value={voice.Id}>{voice.Name}</option>;
                                }) : null}
                            </select>
                            <button onClick={() =>
                                this.onGenerate('audioText', 'audioVoice', 'audio')}
                            >
                                Generate
                            </button>
                        </label>
                        <label>
                            Choice Audio:
                            <Dropzone
                                className="dropzone"
                                activeClassName="active"
                                rejectClassName="reject"
                                multiple={false}
                                disableClick={true}
                                accept="audio/*"
                                onDrop={(accepted, rejected) => this.onDrop(accepted, 'prompt')}
                            >
                                <p>{this.state.node.extras.prompt.split('/').pop()}</p>
                            </Dropzone>
                            <audio key={this.state.node.extras.prompt.split('/').pop()} controls>
                                <source src={this.state.node.extras.prompt} type="audio/mpeg" />
                            </audio>
                            <button className="clear" onClick={() => this.onClear('prompt')}>Clear</button>
                            <textarea
                                name="promptText"
                                value={this.state.node.extras.promptText}
                                onChange={this.handleChange.bind(this)}
                            />
                            <select
                                name="promptVoice"
                                value={this.state.node.extras.promptVoice}
                                onChange={this.handleChange.bind(this)}
                            >
                                <option value="" selected disabled hidden>Choose Voice</option>
                                {Array.isArray(this.state.voices) ? this.state.voices.map(voice => {
                                    return <option key={voice.Id} value={voice.Id}>{voice.Name}</option>;
                                }) : null}
                            </select>
                            <button onClick={() =>
                                this.onGenerate('promptText', 'promptVoice', 'prompt')}
                            >
                                Generate
                            </button>
                        </label>
                    </div> : null}

                    {this.state.node.extras.type === 'retry' ? <div>
                        <label>
                            Retry Audio:
                            <Dropzone
                                className="dropzone"
                                activeClassName="active"
                                rejectClassName="reject"
                                multiple={false}
                                disableClick={true}
                                accept="audio/*"
                                onDrop={(accepted, rejected) => this.onDrop(accepted, 'audio')}
                            >
                                <p>{this.state.node.extras.audio.split('/').pop()}</p>
                            </Dropzone>
                            <audio key={this.state.node.extras.audio.split('/').pop()} controls>
                                <source src={this.state.node.extras.audio} type="audio/mpeg" />
                            </audio>
                            <button className="clear" onClick={() => this.onClear('audio')}>Clear</button>
                            <textarea
                                name="audioText"
                                value={this.state.node.extras.audioText}
                                onChange={this.handleChange.bind(this)}
                            />
                            <select
                                name="audioVoice"
                                value={this.state.node.extras.audioVoice}
                                onChange={this.handleChange.bind(this)}
                            >
                                <option value="" selected disabled hidden>Choose Voice</option>
                                {Array.isArray(this.state.voices) ? this.state.voices.map(voice => {
                                    return <option key={voice.Id} value={voice.Id}>{voice.Name}</option>;
                                }) : null}
                            </select>
                            <button onClick={() =>
                                this.onGenerate('audioText', 'audioVoice', 'audio')}
                            >
                                Generate
                            </button>
                        </label>
                    </div> : null}

                    {this.state.node.extras.type === 'ending' ? <div>
                        <label>
                            Ending Audio:
                            <Dropzone
                                className="dropzone"
                                activeClassName="active"
                                rejectClassName="reject"
                                multiple={false}
                                disableClick={true}
                                accept="audio/*"
                                onDrop={(accepted, rejected) => this.onDrop(accepted, 'audio')}
                            >
                                <p>{this.state.node.extras.audio.split('/').pop()}</p>
                            </Dropzone>
                            <audio key={this.state.node.extras.audio.split('/').pop()} controls>
                                <source src={this.state.node.extras.audio} type="audio/mpeg" />
                            </audio>
                            <button className="clear" onClick={() => this.onClear('audio')}>Clear</button>
                            <textarea
                                name="audioText"
                                value={this.state.node.extras.audioText}
                                onChange={this.handleChange.bind(this)}
                            />
                            <select
                                name="audioVoice"
                                value={this.state.node.extras.audioVoice}
                                onChange={this.handleChange.bind(this)}
                            >
                                <option value="" selected disabled hidden>Choose Voice</option>
                                {Array.isArray(this.state.voices) ? this.state.voices.map(voice => {
                                    return <option key={voice.Id} value={voice.Id}>{voice.Name}</option>;
                                }) : null}
                            </select>
                            <button onClick={() =>
                                this.onGenerate('audioText', 'audioVoice', 'audio')}
                            >
                                Generate
                            </button>
                        </label>
                    </div> : null}

                </form>
            </div>
        );
    }
}

export default Editor;
