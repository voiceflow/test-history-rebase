import React, { Component } from 'react';

import 'draft-js/dist/Draft.css'

import VariableText from './components/VariableText';

class Speak extends Component {

    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node
        };
    }

    render() {
        return (
            <div>
                <label className="mb-0">Speech</label><br/>
                <small className="text-muted">{'Use {variable} to add Variables'}</small>
                <div className="mt-1">
                    <VariableText
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
