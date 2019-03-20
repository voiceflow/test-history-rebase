import React, { Component } from 'react';
import _ from 'lodash';
import VariableText from './components/VariableText';
import randomstring from 'randomstring';
import Select from 'react-select';
import {Collapse, Input, InputGroup} from 'reactstrap';
import AudioDrop from '../../../components/Uploads/AudioDrop'
import { VOICES } from 'Constants'

const BLOCK_LIMIT = 50

class Speak extends Component {

    constructor(props) {
        super(props);

        // DEPRECATE SWITCH PEOPLE OFF THE OLD VERSION OF SPEAK
        if(props.node.extras.rawContent){
            props.node.extras.dialogs = [{
                index: randomstring.generate(5),
                voice: 'Alexa',
                rawContent: props.node.extras.rawContent,
                open: true
            }];
            delete props.node.extras.rawContent;
        }else if(!Array.isArray(props.node.extras.dialogs)){
            props.node.extras.dialogs = [{
                index: randomstring.generate(5),
                voice: 'Alexa',
                rawContent: '',
                open: true
            }];
        }

        this.handleAddBlock = this.handleAddBlock.bind(this);
        this.handleRemoveBlock = this.handleRemoveBlock.bind(this);

        this.state = {
            node: this.props.node
        };
    }

    onUpdate() {
        this.forceUpdate();
        this.props.onUpdate();
    }

    handleAddBlock(audio=false) {
        var node = this.state.node;
        this.props.clearRedo()
        this.props.updateEvents(_.cloneDeep(node).extras);
        if(node.extras.dialogs.length < BLOCK_LIMIT){
            if(audio){
                node.extras.dialogs.push({
                    index: randomstring.generate(5),
                    audio: '',
                    open: true
                })
            }else{
                node.extras.dialogs.push({
                    index: randomstring.generate(5),
                    voice: 'Alexa',
                    rawContent: '',
                    open: true
                })
            }
            this.onUpdate()
        }
    }

    handleRemoveBlock(i) {
        let node = this.state.node;
        this.props.clearRedo()
        this.props.updateEvents(_.cloneDeep(node).extras)
        node.extras.dialogs.splice(i, 1)
        this.onUpdate()
    }

    render() {
        let properties = this.state.node.extras
        return (
            <div style={{marginTop: -6}}>
                {properties.dialogs.map((d, i) => {
                    if(d.audio !== undefined){
                        return <div key={d.index} className="multiline mb-2">
                            <div className="multi-title-block">
                                <div className="multi-title" onClick={()=>{d.open = !d.open; this.onUpdate()}}>
                                    <span className="text-muted">
                                        {d.open ? <i className="fas fa-caret-down"></i> : <i className="fas fa-caret-right"></i>} 
                                        {properties.randomize ? <i className="far fa-random"/> : (i + 1)}
                                    </span>
                                </div>
                                <div className="d-flex align-items-center flex-hard">
                                    {d.audio ? d.audio.split('/').pop() : 'Audio'}
                                </div>
                                <button className="close" onClick={() => {this.handleRemoveBlock(i)}}>&times;</button>
                            </div>
                            <Collapse isOpen={d.open} className="speak-audio">
                                <div className="pb-2">
                                    <AudioDrop
                                        audio={d.audio}
                                        update={(audio)=>{
                                            d.audio = audio
                                            this.onUpdate()
                                        }}
                                    />
                                </div>
                            </Collapse>
                            <hr className="mt-2"/>
                        </div>
                    }else{
                        return <div key={d.index} className="multiline mb-2">
                            <div className="multi-title-block mb-2">
                                <div className="multi-title">
                                    <span className="text-muted" onClick={()=>{d.open = !d.open; this.onUpdate()}}>
                                        {d.open ? <i className="fas fa-caret-down"></i> : <i className="fas fa-caret-right"></i>} 
                                        {properties.randomize ? <i className="far fa-random"/> : (i + 1)}
                                    </span>
                                </div>
                                <div className="super-center flex-hard mr-5">
                                    Speaking As
                                    <Select
                                        className="speak-box ml-2"
                                        classNamePrefix="select-box"
                                        value={{label: d.voice, value: d.voice}}
                                        onChange={(selected) => {
                                            d.voice = selected.value;
                                            this.onUpdate()
                                            if (localStorage.getItem('recent_speak')) {
                                                let recent_speaks = JSON.parse(localStorage.getItem('recent_speak'))
                                                if (!recent_speaks instanceof Array) recent_speaks = [recent_speaks]
                                                let idx = _.findIndex(recent_speaks, s => s.value === selected.value)
                                                if (idx === -1) {
                                                    recent_speaks.push(selected)
                                                    if (recent_speaks.length > 3){
                                                        recent_speaks.shift()
                                                    }
                                                    localStorage.setItem('recent_speak', JSON.stringify(recent_speaks))
                                                }
                                            } else {
                                                localStorage.setItem('recent_speak', JSON.stringify([selected]))
                                            }
                                        }}
                                        // options={VOICES}
                                        options={localStorage.getItem('recent_speak') ? [{ label: 'Recent', options: JSON.parse(localStorage.getItem('recent_speak')) }].concat(VOICES) : VOICES}
                                    />
                                </div>
                                <button className="close" onClick={() => {this.handleRemoveBlock(i)}}>&times;</button>
                            </div>
                            <Collapse isOpen={d.open}>
                                <VariableText
                                    className="editor form-control auto-height"
                                    raw={d.rawContent}
                                    placeholder={<React.Fragment>{`Tell ${d.voice} what to say`}<br/>{'Use {variable} to add Variables'}</React.Fragment>}
                                    variables={this.props.variables}
                                    updateRaw={(raw) => {d.rawContent = raw; this.props.onUpdate()}}
                                />
                            </Collapse>
                            <hr/>
                        </div>
                    }
                })}
                { properties.dialogs.length < BLOCK_LIMIT ?
                    <React.Fragment>
                        <div className="d-flex my-3">
                            <button className="btn btn-clear btn-vertical mr-3" onClick={() => this.handleAddBlock(false)}>
                                <img src={'/comment.svg'} alt="comment" className="mr-2" width='20px'/>
                                Add Speech
                            </button>
                            <button className="btn-clear btn-vertical" onClick={() => this.handleAddBlock(true)}>
                            <img src={'/volume.svg'} alt="volume" className="mr-2" width='20px'/>
                                Add Audio
                            </button>
                        </div>
                        <InputGroup className="my-2">
                            <label className="input-group-text w-100 text-left">
                                <Input addon type="checkbox" checked={!!properties.randomize} onChange={()=>{properties.randomize = !properties.randomize; this.forceUpdate()}}/>
                                <span className="ml-1">Output Random Entry</span>
                            </label>
                        </InputGroup>
                    </React.Fragment>
                    : null
                }
            </div>
        );
    }
}

export default Speak;
