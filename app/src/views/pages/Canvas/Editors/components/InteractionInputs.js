import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
import './InteractionInputs.css'
import { Collapse } from 'reactstrap';

class InteractionInputs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            choices: this.props.choices,
            inputs: this.props.inputs,
            textEntries: [],
            open: this.props.open
        };
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onDeleteUtterance = this.onDeleteUtterance.bind(this);

    }

    toggleCollapse(i){
        const open = this.state.open;
        open[i] = !open[i]
        this.setState({
            open: open
        });
    }

    componentWillReceiveProps(props) {
        this.setState({
            choices: props.choices,
            inputs: props.inputs,
            open: props.open
        });
    }

    handleKeyPress(e, i) {
        // Enter key pressed
        if(e.charCode==13){
            e.preventDefault();
            const inputs = this.state.inputs;
            const textEntries = this.state.textEntries;
            const newValue = e.target.value;
            if (!Array.isArray(inputs[i])) {
                inputs[i] = [];
            }
            if (newValue) {
                inputs[i].push(newValue);
                textEntries[i] = '';
            }
            this.setState({
                inputs: inputs,
                textEntries: textEntries
            })
        }
    }

    onTextChange(value, i) {
        const textEntries = this.state.textEntries;
        textEntries[i] = value;
        this.setState({
            textEntries: textEntries
        })
    }

    onDeleteUtterance(e, i, choice_i) {
        const inputs = this.state.inputs;
        console.log(inputs, i, choice_i)
        inputs[choice_i].splice(i, 1);
        this.setState({
            inputs: inputs
        })
    }

    render() {

        const renderUtterances = (utterances, choice_i) => {
            if (Array.isArray(utterances)) {
                return utterances.map( (u, i) => {
                    return <div className="interaction-utterance" key={i}><div>{u}</div><a><i onClick={(e) => {this.onDeleteUtterance(e, i, choice_i)}} className="fas fa-backspace trash-icon"></i></a></div>
                });
            }
            return null
        }

        return (
            <div className="w-100">
                {Array.isArray(this.state.choices) ? this.state.choices.map((choice, i) => {
                    return (
                        <div className="interaction-block" key={i}>
                            <a onClick={() => {this.toggleCollapse(i)}}>
                                <div className="interaction-title">
                                    <span>{this.state.open[i] ? <i className="fas fa-caret-down"></i> : <i className="fas fa-caret-right"></i>}   {i+1}</span><div>Choice {i+1}</div>
                                    <button className="close" onClick={e => this.props.onRemove(e, i)}>&times;</button>
                                </div>
                            </a>
                            <Collapse isOpen={this.state.open[i]}>
                            {renderUtterances(this.state.inputs[i], i)}
                                <Textarea 
                                    className="input-area"
                                    name="inputs" 
                                    value={this.state.textEntries[i]} 
                                    onKeyPress={ (target) => {this.handleKeyPress(target, i)}}
                                    onChange={(e) => {this.onTextChange(e.target.value, i)}}
                                    placeholder="What would a user say to select this choice? (Press Enter after typing out each example)" 
                                />
                            </Collapse>
                        </div> )
                }) : null}
                <div><button className="btn btn-default btn-block" onClick={this.props.onAdd}><i className="far fa-plus"></i> Add Choice</button></div>
            </div>
        );
    }
}

export default InteractionInputs;
