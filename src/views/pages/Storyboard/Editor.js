import React, { Component } from 'react';
import $ from 'jquery';
import Line from './Editors/Line';
import Choice from './Editors/Choice';
import Ending from './Editors/Ending';
import Retry from './Editors/Retry';
import Listen from './Editors/Listen';
import Story from './Editors/Story';
import RandomBlock from './Editors/Random';
import SetBlock from './Editors/Set';
import IfBlock from './Editors/If';
import Speak from './Editors/Speak';
import Capture from './Editors/Capture';

class Editor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node,
            voices: []
        };

        this.BlockViewer = this.BlockViewer.bind(this)
    }

    componentDidMount() {
        // $('*').keypress(function(e) {
        //     if ((e.keyCode === 13 || e.which === 13) && e.target.name !== 'inputs' && !e.target.name.endsWith('Text')) {
        //         e.preventDefault();
        //     }
        // });
        $.ajax({
            url: '/voices',
            type: 'GET',
            success: res => {
                this.setState({
                    voices: res
                });
            },
            error: () => {window.alert('Error11');}
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
        } else if (key !== undefined && typeof key === 'string') {
            node.extras[name][key] = value;
        } else {
            node.extras[name] = value;
        }
        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    BlockViewer() {
        switch(this.state.node.extras.type) {
            case 'story':
                return <Story node={this.state.node} voices={this.state.voices} onUpdate={this.props.onUpdate}/>;
            case 'choice':
                return <Choice
                        node={this.state.node} 
                        voices={this.state.voices} 
                        onUpdate={this.props.onUpdate}
                        repaint={this.props.repaint}
                    />
            case 'choicenew':
                return <Choice
                        node={this.state.node} 
                        voices={this.state.voices} 
                        onUpdate={this.props.onUpdate}
                        repaint={this.props.repaint}
                    />
            case 'line':
                return <Line node={this.state.node} voices={this.state.voices} onUpdate={this.props.onUpdate}/>
            case 'multiline':
                return <Line node={this.state.node} voices={this.state.voices} onUpdate={this.props.onUpdate}/>
            case 'set':
                return <SetBlock node={this.state.node} variables={this.props.variables} onVariable={this.props.onVariable} onUpdate={this.props.onUpdate}/>
            case 'if':
                return <IfBlock node={this.state.node} variables={this.props.variables} onUpdate={this.props.onUpdate}/>
            case 'listen':
                return <Listen node={this.state.node} voices={this.state.voices} onUpdate={this.props.onUpdate}/>
            case 'random':
                return <RandomBlock node={this.state.node} onUpdate={this.props.onUpdate} repaint={this.props.repaint} />
            case 'retry':
                return <Retry node={this.state.node} voices={this.state.voices} onUpdate={this.props.onUpdate}/>
            case 'ending':
                return <Ending node={this.state.node} voices={this.state.voices} onUpdate={this.props.onUpdate}/>
            case 'speak':
                return <Speak node={this.state.node} onUpdate={this.props.onUpdate} variables={this.props.variables}/>
            case 'capture':
                return <Capture node={this.state.node} onUpdate={this.props.onUpdate} variables={this.props.variables}/>
            default:
              return null;
        }
    }

    render() {

        const type = this.state.node ? this.state.node.extras.type : null;

        return (
            <div className={"Editor" + (this.props.open && type ? ' open':'')}>
                {type ?
                    <form onSubmit={(e) => e.preventDefault()} className="controls">
                        <div className="top">
                            <div className="property">
                                <button className="close" onClick={this.props.onClose}>&times;</button>
                                <div className={"block " + type}>{type} block</div>
                            </div>
                            <div>
                                <input id="label" placeholder="Block Label" 
                                    type="text"
                                    name="name"
                                    value={this.state.node.name}
                                    onChange={this.handleChange.bind(this)}
                                />
                            </div>
                        </div>
                        {this.BlockViewer()}
                    </form> 
                : null}
            </div>
        );
    }
}

export default Editor;
