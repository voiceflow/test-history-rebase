import React, { Component } from 'react';
import Expression from './Expression';
import Expressionfy from './Expressionfy';

class IfBlock extends Component {
    constructor(props) {
        super(props);

        let node = this.props.node;

        if(!node.extras.expression || !node.extras.expression.type){
            node.extras.expression = {
                type: 'value',
                value: '',
                depth: 0
            }
        }

        this.state = {
            node: node
        };

        this.onUpdate = this.onUpdate.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            node: props.node
        });
    }

    onUpdate(){
        this.setState({
            node: this.state.node
        }, this.props.onUpdate);
    }

    render() {
        let show = !(this.state.node.extras.expression.type === 'value' || this.state.node.extras.expression.type === 'variable');

        return (
            <div key={this.state.node.id}>
                <label>If </label>
                { show ? <Expressionfy expression={this.state.node.extras.expression} />:null}
                <Expression expression={this.state.node.extras.expression} variables={this.props.variables} onUpdate={this.onUpdate}/>
            </div>
        );
    }
}

export default IfBlock;
