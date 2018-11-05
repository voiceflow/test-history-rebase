import React, { Component } from 'react';

import Select from 'react-select';

import 'draft-js/dist/Draft.css'

import VariableText from './components/VariableText';

class Speak extends Component {

    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node
        };
    }

    componentWillReceiveProps(props) {
        if(props.node.id !== this.state.node.id){
            let node = props.node;
            this.setState({
                node: props.node
            });
        }
    }

    componentWillUnmount(){
        // let node = this.state.node;
        // node.extras.raw = convertToRaw(this.state.editorState.getCurrentContent());
    }

    render() {
        return (
            <div>
                <label>Speech</label>
                <VariableText
                    state={this.state.node.id}
                    focus 
                    raw={this.state.node.extras.raw}
                    variables={this.props.variables}
                    updateRaw={(raw) => {
                        let node = this.state.node; 
                        node.extras.raw = raw;
                    }}
                />
            </div>
        );
    }
}

export default Speak;
