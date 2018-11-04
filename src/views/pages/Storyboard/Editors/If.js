import React, { Component } from 'react';
import Expression from './components/Expression';
import Expressionfy from './components/Expressionfy';
import VariableInput from './components/VariableInput';

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
        if(props.node.id !== this.state.node.id){
            let node = props.node;

            if(!node.extras.expression || !node.extras.expression.type){
                node.extras.expression = {
                    type: 'value',
                    value: '',
                    depth: 0
                }
            }

            this.setState({
                node: props.node
            });
        }
    }

    onUpdate(){
        this.setState({
            node: this.state.node
        }, this.props.onUpdate);
    }
//                 { show ? <Expressionfy expression={this.state.node.extras.expression} />:null}
                // <Expression expression={this.state.node.extras.expression} variables={this.props.variables} onUpdate={this.onUpdate}/>
    render() {
        let show = !(this.state.node.extras.expression.type === 'value' || this.state.node.extras.expression.type === 'variable');

        return (
            <div>
                <label>If </label>
                <VariableInput 
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

export default IfBlock;
