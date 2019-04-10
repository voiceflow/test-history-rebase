import React, { Component } from 'react';
import _ from 'lodash'
import { InputGroup, Input } from 'reactstrap';

class RandomBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node
        };

        this.handleAddPath = this.handleAddPath.bind(this);
        this.handleRemovePath = this.handleRemovePath.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleAddPath(e) {
        var node = this.state.node;

        node.extras.paths++;

        let path = node.addOutPort(node.extras.paths);
        path.setMaximumLinks(1);

        if (node.parentCombine) {
            let isLast = _.last(node.parentCombine.combines).id === node.id
            let newPort = _.differenceBy(node.getOutPorts(), node.parentCombine.getOutPorts(), 'id');
            if (isLast) {
                node.parentCombine.ports[newPort[0].name] = newPort[0]
                node.parentCombine.ports[newPort[0].name].parent = node.parentCombine
            }
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

    handleRemovePath() {
        let node = this.state.node;

        if(node.extras.paths <= 1){
            return;
        }

        let ports = node.getPorts();

        for (let name in ports) {
            let port = node.getPort(name);
            if(port.in) continue;

            if (port.label === node.extras.paths) {
                node.removePort(port);
                if (node.parentCombine) {
                    node.parentCombine.removePort(port);
                    let bestNode = _.findIndex(node.parentCombine.combines, npc => npc.name === node.name)
                    node.parentCombine.combines[bestNode].ports = _.filter(node.parentCombine.combines[bestNode].ports, p => p.id !== port.id)
                    node.parentCombine.combines[bestNode].extras.path--;
                }
                break;
            }
        }

        node.extras.paths--;


        this.setState({
            node: node
        }, this.props.onUpdate);
        
        this.props.repaint();
    }

    handleInputChange(event) {
        let node = this.state.node;
        node.extras.smart = event.target.checked;
        if (node.parentCombine) {
            let bestNode = _.findIndex(node.parentCombine.combines, npc => npc.id === node.id)
            node.parentCombine.combines[bestNode] = node

        }
        this.setState({
          node: node
        }, this.props.onUpdate);
        this.props.repaint()
    }

    render() {
        return (
            <div>
                <div><button className="btn btn-clear btn-lg btn-block mt-2" onClick={this.handleAddPath}>Add Path</button></div>
                {this.state.node.extras.paths > 1 ? <div className="mt-2"><button className="btn btn-tertiary btn-lg btn-block" onClick={this.handleRemovePath}>Remove Path</button></div> : null }
                <InputGroup className="my-3">
                    <label className="input-group-text w-100 m-0 text-left">
                        <Input addon type="checkbox" checked={!!this.state.node.extras.smart} onChange={this.handleInputChange}/>
                        <span className="ml-3">No duplicates</span>
                    </label>
                </InputGroup>
            </div>
        );
    }
}


export default RandomBlock;