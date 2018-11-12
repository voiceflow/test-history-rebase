import React, {Component} from 'react';
import $ from 'jquery';
import { Collapse } from 'reactstrap';
import Select from 'react-select';
import Textarea from 'react-textarea-autosize';

class TextVoice extends Component {

	constructor(props) {
        super(props);

        this.state = {
            collapse: true
        }

        this.onGenerate = this.onGenerate.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    // onEffect(name, effect) {
    //     var textArea = $("[name='"+name+"']")[0];
    //     var start = textArea.selectionStart;
    //     var end = textArea.selectionEnd;
    //     var text = this.state.node.extras[name];

    //     var result = null;

    //     if (effect === 'break') {
    //         result = text.substring(0, start)+text.substring(start, end)+'<break />'+text.substring(end, text.length);
    //     }

    //     var state = {};
    //     state[name] = result;
    //     this.setState(state);
    // }

    onGenerate() {
        if(this.props.text && this.props.voice){
            $.ajax({
                url: '/generate',
                type: 'POST',
                data: {
                    text: this.props.text,
                    voice: this.props.voice
                },
                success: res => {
                    // console.log(res);
                    this.props.updateAudio(res);
                },
                error: () => {window.alert('Error33');}
            });
        }
    }

    toggleCollapse(target){
        this.setState({
            collpase: !this.state.collpase
        });
    }

	render() {
        return <div className="text-to-voice">
            <div className="subtitle" onClick={this.toggleCollapse}>Text to Speech {this.state.collpase ? <i className="fas fa-caret-down"></i> : <i className="fas fa-caret-right"></i>}</div>
            <Collapse isOpen={this.state.collpase}>
                <div className="textarea-collapse">
                    <Textarea
                        name="promptText"
                        value={this.props.text}
                        onChange={this.props.updateText}
                        minRows={2}
                        placeholder="Enter text you want to convert here"
                    />
                    <div className="btn-group w-100">
                        <Select
                            placeholder="Select Voice"
                            className="select-box input-select"
                            value={this.props.voice ? {label: this.props.voice, value: this.props.voice} : null}
                            onChange={this.props.updateVoice}
                            options={this.props.voices.map(voice => {
                                return {label: voice.Name, value: voice.Id}
                            })}
                        />
                        <button className="btn btn-primary" onClick={this.onGenerate}>
                            Generate
                        </button>
                    </div>
                </div>
            </Collapse>
        </div>
	}
}

export default TextVoice;