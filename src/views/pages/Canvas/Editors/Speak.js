import React, { Component } from 'react';
import VariableText from './components/VariableText';
import randomstring from 'randomstring';
import Select from 'react-select';
import {Collapse} from 'reactstrap';

const voices = [
    {
        label: 'Default',
        options: [
            {value: 'Alexa', label: 'Alexa'}
        ]
    },
    {
        label: 'English US',
        options: [
            {value: 'Ivy', label: 'Ivy'},
            {value: 'Joanna', label: 'Joanna'},
            {value: 'Joey', label: 'Joey'},
            {value: 'Justin', label: 'Justin'},
            {value: 'Kendra', label: 'Kendra'},
            {value: 'Kimberly', label: 'Kimberly'},
            {value: 'Matthew', label: 'Matthew'},
            {value: 'Salli', label: 'Salli'},
        ]
    },
    {
        label: 'English AU',
        options: [
            {value: 'Nicole', label: 'Nicole'},
            {value: 'Russell', label: 'Russell'},
        ]
    },
      {
        label: 'English GB',
        options: [
            {value: 'Amy', label: 'Amy'},
            {value: 'Brian', label: 'Brian'},
            {value: 'Emma', label: 'Emma'}
        ]
    },
    {
        label: 'English IN',
        options: [
            {value: 'Aditi', label: 'Aditi'},
            {value: 'Raveena', label: 'Raveena'},
        ]
    },
    {
        label: 'German',
        options: [
            {value: 'Hans', label: 'Hans'},
            {value: 'Marlene', label: 'Marlene'},
            {value: 'Vicki', label: 'Vicki'},
        ]
    },
    {
        label: 'Spanish',
        options: [
            {value: 'Conchita', label: 'Conchita'},
            {value: 'Enrique', label: 'Enrique'},
        ]
    },
    {
        label: 'Italian',
        options: [
            {value: 'Carla', label: 'Carla'},
            {value: 'Giorgio', label: 'Giorgio'},
        ]
    },
    {
        label: 'Japanese',
        options: [
            {value: 'Mizuki', label: 'Mizuki'},
            {value: 'Takumi', label: 'Takumi'},
        ]
    },
    {
        label: 'French',
        options: [
            {value: 'Celine', label: 'Celine'},
            {value: 'Lea', label: 'Lea'},
            {value: 'Mathieu', label: 'Mathieu'},
        ]
    }
]

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
        }else if(!Array.isArray(props.node.extras.dialogs) || props.node.extras.dialogs.length === 0){
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

    handleAddBlock() {
        var node = this.state.node;

        if(node.extras.dialogs.length < 20){
            node.extras.dialogs.push({
                index: randomstring.generate(5),
                voice: 'Alexa',
                rawContent: '',
                open: true
            });
            this.onUpdate();
        }
    }

    handleRemoveBlock(i) {
        let node = this.state.node;

        if(node.extras.dialogs.length > 1){
            node.extras.dialogs.splice(i, 1);
            this.onUpdate();
        }
    }

    render() {
        // <label className="mb-0">Speech <br/><small className="text-muted">{'Use {variable} to add Variables'}</small></label>
        return (
            <div>
                <div className="mb-2"><small className="text-muted">{''}</small></div>
                {this.state.node.extras.dialogs.map((d, i) => {
                    return <div key={d.index} className="multiline mb-1">
                        <div className="multi-title-block mb-1">
                            <div className="multi-title">
                                <span className="text-muted" onClick={()=>{d.open = !d.open; this.onUpdate()}}>{d.open ? <i className="fas fa-caret-down"></i> : <i className="fas fa-caret-right"></i>} {i + 1}</span>
                            </div>
                            <div className="super-center flex-hard">
                                <b>Speak As</b>
                                <Select
                                    className="speak-box"
                                    classNamePrefix="select-box"
                                    value={{label: d.voice, value: d.voice}}
                                    onChange={(selected) => {d.voice = selected.value; this.onUpdate()}}
                                    options={voices}
                                />
                            </div>
                            {(this.state.node.extras.dialogs.length > 1) && <button className="close" onClick={() => {this.handleRemoveBlock(i)}}>&times;</button>}
                        </div>
                        <Collapse isOpen={d.open}>
                            <VariableText
                                raw={d.rawContent}
                                placeholder={<React.Fragment>{`Tell ${d.voice} what to say`}<br/>{'Use {variable} to add Variables'}</React.Fragment>}
                                variables={this.props.variables}
                                updateRaw={(raw) => {d.rawContent = raw; this.props.onUpdate()}}
                            />
                        </Collapse>
                        <hr/>
                    </div>
                })}
                { this.state.node.extras.dialogs.length < 20 ?
                    <button className="btn btn-outline-add btn-block mt-3" onClick={this.handleAddBlock}>
                        <i className="far fa-plus"></i> Add Speech
                    </button> : null
                }
            </div>
        );
    }
}

export default Speak;
