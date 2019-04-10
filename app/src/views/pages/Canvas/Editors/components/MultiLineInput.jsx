import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
import Select from 'react-select';
import AudioDrop from './../../../../components/Uploads/AudioDrop'
import { Collapse } from 'reactstrap';

class MultiLineInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            line: this.props.line,
            voices: this.props.voices,
            index: this.props.index
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            line: props.line,
            voices: props.voices,
            index: props.index
        });
    }

    handleChange(e, key = undefined) {
        let line = this.state.line;
        let name = e.target.getAttribute('name');
        let value = e.target.value;
        line[name] = value;
        this.setState({
            line: line
        }, this.props.onUpdate);
    }

    handleSelection(selected){
        let line = this.state.line;
        line.voice = selected.value;

        this.setState({
            line: line
        }, this.props.onUpdate);
    }

    toggleCollapse(target){
        let line = this.state.line;
        line[target] = !!!line[target];
        this.setState({
            line: line
        }, this.props.onUpdate);
    }

    onGenerate(text, voice) {
        alert('Text to Speech is Deprecated - Please Use the Speak Block');
    }

    render() {
        return (
            // DEPRECATE TEXT TO VOICE SOON
            <div className="multiline">
                <div className="multi-title-block" >
                    <div className="multi-title" onClick={()=>{this.toggleCollapse('collapse')}}>
                        <span className="text-muted">{this.state.line.collapse ? <i className="fas fa-caret-down"></i> : <i className="fas fa-caret-right"></i>} {this.state.index + 1}</span> {this.state.line.title} 
                    </div>
                    <button className="close" onClick={() => {this.props.onRemove(this.state.index)}}></button>
                </div>
                <Collapse isOpen={this.state.line.collapse}>
                    <AudioDrop
                        audio={this.state.line.audio}
                        update={(audio)=>{
                            let line = this.state.line
                            line.audio = audio
                            this.setState({line: line}, this.props.newAudio)
                        }}
                    />
                    {this.state.line.text && this.state.line.textCollapse !== undefined ?
                        <div className="text-to-voice">
                            <div className="subtitle" onClick={() => this.toggleCollapse("textCollapse")}>Text to Speech {this.state.line.textCollapse ? <i className="fas fa-caret-down"></i> : <i className="fas fa-caret-right"></i>}</div>
                            <Collapse isOpen={this.state.line.textCollapse}>
                                <div className="textarea-collapse">
                                    <Textarea
                                        name="text"
                                        value={this.state.line.text}
                                        onChange={this.handleChange}
                                        minRows={2}
                                        placeholder="Enter text you want to convert here"
                                    />
                                    <div className="btn-group w-100">
                                        <Select
                                            classNamePrefix="select-box"
                                            placeholder="Select Voice"
                                            className="select-box"
                                            value={this.state.line.voice ? {label: this.state.line.voice, value: this.state.line.voice} : null}
                                            onChange={this.handleSelection}
                                            options={Array.isArray(this.state.voices) ? this.state.voices.map(voice => {
                                                return {label: voice.Name, value: voice.Id, target: "voice"}
                                            }) : null}
                                        />
                                        <button className="btn btn-primary" onClick={() => this.onGenerate('text', 'voice')}>
                                            Generate
                                        </button>
                                    </div>
                                </div>
                            </Collapse>
                        </div> : null }
                    <div className="pt-3"></div>
                </Collapse>
                <hr/>
            </div>
        );
    }
}

export default MultiLineInput;
