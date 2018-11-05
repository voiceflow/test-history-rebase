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

    render() {
        return (
            <div>
                <label className="mb-0">Speech</label><br/>
                <small className="text-muted">{'Use {variable} to add Variables'}</small>
                <div className="mt-1">
                    <VariableText
                        change={this.state.node.id}
                        raw={this.state.node.extras.rawContent}
                        variables={this.props.variables}
                        updateRaw={(raw) => {
                            let node = this.state.node; 
                            node.extras.rawContent = raw;
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default Speak;
