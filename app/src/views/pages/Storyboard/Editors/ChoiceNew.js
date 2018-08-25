import React, { Component } from 'react';
import $ from 'jquery';
import Dropzone from 'react-dropzone';
import Textarea from 'react-textarea-autosize';
import ChoiceInputs from './ChoiceInputs';
import Select from 'react-select';
import { Collapse } from 'reactstrap';

class ChoiceNew extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node,
            voices: this.props.voices
        };
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
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

    handleSelection(selected){
        let node = this.state.node;
        node.extras[selected.target] = selected.value;

        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    toggleCollapse(target){
        let node = this.state.node;
        node.extras[target] = !!!node.extras[target];
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
        console.log(test);
        this.setState({
            node: node
        }, this.props.onUpdate);
        $('*').keypress(function(e) {
            if ((e.keyCode === 13 || e.which === 13) && e.target.name !== 'inputs' && !e.target.name.endsWith('Text')) {
                e.preventDefault();
            }
        });
        this.props.repaint();
        e.preventDefault();
    }

    handleRemoveChoice(e, i) {
        var node = this.state.node;
        for (var name in node.getPorts()) {
            var port = node.getPort(name);
            let links = port.getLinks();
            console.log(links);
            if (port.label === node.extras.choices.length) {
                node.removePort(port);
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
                error: () => {window.alert('Error22');}
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
            error: () => {window.alert('Error33');}
        });
    }

    render() {
        return (
            <div key={this.state.node.id}>
                <div>
                    <label>
                        Choice Audio
                    </label>
                    {this.state.node.extras.prompt.length > 0 ? 
                    <div className="audio-box">
                        <button className="btn btn-danger" onClick={() => this.onClear('prompt')}>&times;</button>
                        <div>{this.state.node.extras.prompt.split('/').pop().split('-').pop()}</div>
                        <audio key={this.state.node.extras.prompt.split('/').pop()} controls>
                            <source src={this.state.node.extras.prompt} type="audio/mpeg" />
                        </audio>
                    </div>
                    :
                    <Dropzone
                        className="dropzone"
                        activeClassName="active"
                        rejectClassName="reject"
                        multiple={false}
                        disableClick={false}
                        accept="audio/*"
                        onDrop={(accepted, rejected) => this.onDrop(accepted, 'prompt')}
                    >
                    <div>
                        <div className="prompt">
                            <b>Drag and Drop Files here</b><br/>
                            <small>OR</small><br/>
                            <i className="fas fa-plus-circle"></i> Add Files
                        </div>
                        <div className="rejected-file text-danger">
                            <b>File not Accepted</b> <i className="far fa-frown ml-1"></i>
                        </div>
                    </div>
                    </Dropzone>}
                    <div className="text-to-voice">
                        <div className="subtitle" onClick={() => this.toggleCollapse("promptTextCollapse")}>Text to Speech {this.state.node.extras.promptTextCollapse ? <i className="fas fa-caret-down"></i> : <i className="fas fa-caret-right"></i>}</div>
                        <Collapse isOpen={this.state.node.extras.promptTextCollapse}>
                            <div className="textarea-collapse">
                                <Textarea
                                    name="promptText"
                                    value={this.state.node.extras.promptText}
                                    onChange={this.handleChange}
                                    minRows={2}
                                    placeholder="Enter text you want to convert here"
                                />
                                <div className="btn-group w-100">
                                    <Select
                                        placeholder="Select Voice"
                                        className="select-box"
                                        value={this.state.node.extras.promptVoice ? {label: this.state.node.extras.promptVoice, value: this.state.node.extras.promptVoice} : null}
                                        onChange={this.handleSelection}
                                        options={Array.isArray(this.state.voices) ? this.state.voices.map(voice => {
                                            return {label: voice.Name, value: voice.Id, target: "promptVoice"}
                                        }) : null}
                                    />
                                    <button className="btn btn-primary" onClick={() => this.onGenerate('promptText', 'promptVoice', 'prompt')}>
                                        Generate
                                    </button>
                                </div>
                            </div>
                        </Collapse>
                    </div>
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

export default ChoiceNew;
