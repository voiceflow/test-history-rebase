import React, { Component } from 'react';
import _ from 'lodash';
import update from 'immutability-helper'
import SpeakElement from './components/SpeakElement'
import randomstring from 'randomstring';
import { Input, InputGroup} from 'reactstrap';
// import HTML5Backend from 'react-dnd-html5-backend'
// import { DragDropContext } from 'react-dnd'

const BLOCK_LIMIT = 50

export class Speak extends Component {

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
        this.onUpdate = this.onUpdate.bind(this)

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

    reorder = (dragIndex, hoverIndex) => {
        const drag = this.state.node.extras.dialogs[dragIndex]
        let node = this.state.node
        node.extras.dialogs.splice(dragIndex, 1)
        node.extras.dialogs.splice(hoverIndex, 0, drag)
        this.onUpdate();
    }
    render() {
        let properties = this.state.node.extras

        return (
            <div style={{marginTop: -6}}>
                {properties.dialogs.map((d, i) => 
                    <SpeakElement
                        d={d}
                        toggleOpen={() => {d.open = !d.open; this.onUpdate()}}
                        key={d.index}
                        index={i}
                        id={d.index}
                        reorder={this.reorder}
                        properties={properties}
                        variables={this.props.variables}
                        onUpdate={this.onUpdate}
                        handleRemoveBlock={this.handleRemoveBlock}
                    />
                )}
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
