import React, { Component } from 'react';
import $ from 'jquery';
import Line from './Editors/Line';
import Choice from './Editors/Choice';
import Ending from './Editors/Ending';
import Retry from './Editors/Retry';
import Listen from './Editors/Listen';
import Story from './Editors/Story';

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

    render() {
        return (
            <div key={this.state.node.id}>
                <form onSubmit={(e) => e.preventDefault()} className="controls">
                    <div className="top">
                        <div className="property">
                            <button className="close" onClick={this.props.onClose}>&times;</button>
                            <div className={"block " + this.state.node.extras.type}>{this.state.node.extras.type} block</div>
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

                    {this.state.node.extras.type === 'story' ? 
                    <Story node={this.state.node} voices={this.state.voices} onUpdate={() => this.setState({}, this.props.onUpdate)}/> : null}

                    {this.state.node.extras.type === 'choice' ?  
                    <Choice 
                        node={this.state.node} 
                        voices={this.state.voices} 
                        onUpdate={() => this.setState({}, this.props.onUpdate)}
                        repaint={this.props.repaint}
                    /> : null}

                    {this.state.node.extras.type === 'line' ? 
                    <Line node={this.state.node} voices={this.state.voices} onUpdate={() => this.setState({}, this.props.onUpdate)}/> : null}

                    {this.state.node.extras.type === 'listen' ? 
                    <Listen node={this.state.node} voices={this.state.voices} onUpdate={() => this.setState({}, this.props.onUpdate)}/> : null}

                    {this.state.node.extras.type === 'retry' ? 
                    <Retry node={this.state.node} voices={this.state.voices} onUpdate={() => this.setState({}, this.props.onUpdate)}/> : null}

                    {this.state.node.extras.type === 'ending' ?  
                    <Ending node={this.state.node} voices={this.state.voices} onUpdate={() => this.setState({}, this.props.onUpdate)}/> : null}

                </form>
            </div>
        );
    }
}

export default Editor;
