import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
import UtteranceList from './UtteranceList'

class InteractionInputs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            choices: this.props.choices,
            inputs: this.props.inputs,
            textEntries: []
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            choices: props.choices,
            inputs: props.inputs,
        });
    }

    handleKeyPress(e, i) {
        // Enter key pressed
        if(e.charCode==13){
            const newValue = e.target.value;
            if (!Array.isArray(this.state.inputs[i])) {
                this.state.inputs[i] = [];
            }
            this.state.inputs[i].push(newValue);
        }
    }

    onTextChange(value, i) {
        this.state.textEntries[i] = value
    }

    render() {
        return (
            <div className="w-100">
                {Array.isArray(this.state.choices) ? this.state.choices.map((choice, i) => {
                    return (
                        <div key={i} className="interaction-block">
                            <div className="interaction-title">
                                <span>{i+1}</span>
                                <button className="close" onClick={e => this.props.onRemove(e, i)}>&times;</button>
                            </div>
                            <UtteranceList utterances={this.state.inputs[i]}/>
                            <Textarea 
                                name="inputs" 
                                value={this.state.textEntries[i]} 
                                onKeyPress={ (target) => {this.handleKeyPress(target, i)}}
                                onChange={(e) => {this.onTextChange(e.target.value, i)}}
                                placeholder="What would a user say to select this choice? (Press Enter after typing out each example)" 
                            />
                        </div> )
                }) : null}
                <div><button className="btn btn-default btn-block" onClick={this.props.onAdd}><i className="far fa-plus"></i> Add Choice</button></div>
            </div>
        );
    }
}

export default InteractionInputs;
