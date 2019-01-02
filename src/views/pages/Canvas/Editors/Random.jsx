import React, { Component } from 'react';
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

    handleAddPath() {
        let node = this.state.node;

        node.extras.paths++;

        let path = node.addOutPort(node.extras.paths);
        path.setMaximumLinks(1);

        this.setState({
            node: node
        }, this.props.onUpdate);

        this.props.repaint();
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

        this.setState({
          node: node
        }, this.props.onUpdate);
    }

    render() {
        return (
            <div>
                <InputGroup className="my-3">
                    <label className="input-group-text w-100 m-0 text-left">
                        <Input addon type="checkbox" checked={!!this.state.node.extras.smart} onChange={this.handleInputChange}/>
                        <span className="ml-2">No duplicates</span>
                    </label>
                </InputGroup>
                <div><button className="btn btn-clear btn-lg btn-block" onClick={this.handleAddPath}><i className="fal fa-plus"/> Add Path</button></div>
                {this.state.node.extras.paths > 1 ? <div className="mt-3"><button className="btn btn-clear btn-lg btn-block" onClick={this.handleRemovePath}>Remove Path <i className="fas fa-minus-circle ml-1"></i></button></div> : null }
            </div>
        );
    }
}

export default RandomBlock;
