import React, { Component } from 'react';
import _ from 'lodash';
import Expression from './components/Expression';
import Expressionfy from './components/Expressionfy';

const BLOCK_LIMIT = 50

class IfBlock extends Component {
    constructor(props) {
        super(props);

        let node = this.props.node;

        if(!Array.isArray(node.extras.expressions)){
            node.extras.expressions = []
        }

        this.state = {
            node: node
        };

        this.onUpdate = this.onUpdate.bind(this);
        this.handleAddBlock = this.handleAddBlock.bind(this);
        this.handleRemoveBlock = this.handleRemoveBlock.bind(this);
    }

    onUpdate(){
        this.forceUpdate();
        this.props.onUpdate();
    }

    handleAddBlock(e) {
        var node = this.state.node;
        this.props.clearRedo();
        this.props.updateEvents(_.cloneDeep(node).extras, _.cloneDeep(node).ports);

        if(node.extras.expressions.length < BLOCK_LIMIT){
            node.extras.expressions.push({
                type: 'value',
                value: '',
                depth: 0
            });

            // Remove the else port and add it back in so that it is always on the bottom
            // for (var name in node.getPorts()) {
            //     let port = node.getPort(name);
            //     if (port.label === 'else') {
            //         elseport = port;
            //         node.removePort(port, false);
            //         break;
            //     }
            // }

            node.addOutPort(node.extras.expressions.length).setMaximumLinks(1);
            if (node.parentCombine) {
                let bestNode = _.findIndex(node.parentCombine.combines, npc => npc.id === node.id)
                node.parentCombine.combines[bestNode] = node

            }
            this.setState({
                node: node
            }, this.props.onUpdate);
            // this.props.diagramEngine.setSuperSelect(node.parentCombine);
            this.props.repaint();
            e.preventDefault()
        }
    }

    handleRemoveBlock(i) {
        let node = this.state.node;
        this.props.clearRedo();
        this.props.updateEvents(_.cloneDeep(node).extras, _.cloneDeep(node).ports);
        
        if(node.extras.expressions.length > 1){
            let bestNode;
            if (node.parentCombine){
                bestNode = _.findIndex(node.parentCombine.combines, npc => npc.name === node.name)
            }
            for (var name in node.getPorts()) {
                var port = node.getPort(name);

                if (port.label === node.extras.expressions.length) {
                    node.removePort(port);
                    break;
                }
            }

            node.extras.expressions.splice(i, 1);
            if (node.parentCombine){
                node.parentCombine.combines[bestNode] = node
            }
            this.setState({
                node: node
            }, this.props.onUpdate);

            this.props.repaint();
        }
    }


    render() {
        return (
            <div>
                <p>
                    <small className="text-muted">If statements are evaluated in numerical order</small>
                </p>
                {this.state.node.extras.expressions.map((expression, i) => {
                    let show = !(expression.type === 'value' || expression.type === 'variable');

                    return (
                        <div key={i} className="solid-border set-block">
                            {this.state.node.extras.expressions.length > 1 ?
                                <div className="close" onClick={()=>this.handleRemoveBlock(i)}></div> 
                                : null 
                            }
                            <div className="variable-group">
                                <div className="number-bubble mr-2">{i + 1}</div><span>If </span>
                            </div>
                            { show ? <Expressionfy expression={expression}/> : null}
                            <Expression expression={expression} variables={this.props.variables} onUpdate={this.onUpdate}/>
                        </div>
                    )
                })}

                { this.state.node.extras.expressions.length < BLOCK_LIMIT ?
                    <div className="text-center"><button className="btn-tertiary-variable mt-1" onClick={this.handleAddBlock}>
                    Add If Statement
                    </button></div> : null
                }
            </div>
        );
    }
}

export default IfBlock;
