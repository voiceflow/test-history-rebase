import React, { Component } from 'react';
import _ from 'lodash';
import ChoiceInputs from './components/ChoiceInputs';

class Choice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node,
            voices: Array.isArray(this.props.voices) ? this.props.voices : []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleAddChoice = this.handleAddChoice.bind(this);
        this.handleRemoveChoice = this.handleRemoveChoice.bind(this);
    }

    handleChange(e, key = undefined) {
        var node = this.state.node;
        var name = e.target.getAttribute('name');
        var value = e.target.value;
        if (name === 'name') {
            node[name] = value;
        } else if (key !== undefined && (typeof key === 'string' || typeof key === 'number')) {
            node.extras[name][key] = value;
        } else {
            node.extras[name] = value;
        }
        if (node.parentCombine) {
            let bestNode = _.findIndex(
                node.parentCombine.combines,
                npc => npc.id === node.id
            );
            node.parentCombine.combines[bestNode] = node.serialize();
        }
        this.setState({
            node: node
        }, this.props.onUpdate);
        this.props.repaint();
    }

    handleAddChoice(e) {
        // console.log(this.state.node.extras.choices);
        var node = this.state.node;
        this.props.clearRedo();
        this.props.updateEvents(_.cloneDeep(node).extras, _.cloneDeep(node).ports);
        node.extras.choices.push('New Choice');
        node.extras.inputs.push('');
        let test = node.addOutPort(node.extras.choices.length);
        test.setMaximumLinks(1);
        if (node.parentCombine) {
            let isLast = _.last(node.parentCombine.combines).id === node.id
            let newPort = _.differenceBy(node.getOutPorts(), node.parentCombine.getOutPorts(), 'id');
            if (isLast) {
                node.parentCombine.ports[newPort[0].name] = newPort[0]
                node.parentCombine.ports[newPort[0].name].parent = node.parentCombine
            }
            let bestNode = _.findIndex(node.parentCombine.combines, npc => npc.id === node.id)
            node.parentCombine.combines[bestNode] = node.serialize()

        }
        this.setState({
            node: node
        }, this.props.onUpdate);
        // this.props.diagramEngine.setSuperSelect(node.parentCombine);
        this.props.repaint();
        e.preventDefault();
    }

    handleRemoveChoice(e, i) {
        var node = this.state.node;
        this.props.clearRedo();
        this.props.updateEvents(_.cloneDeep(node).extras, _.cloneDeep(node).ports);
        let bestNode;
        if (node.parentCombine) {
            bestNode = _.findIndex(node.parentCombine.combines, npc => npc.id === node.id)
        }
        for (var name in node.getPorts()) {
            var port = node.getPort(name);

            if (port.label === node.extras.choices.length) {
                node.removePort(port);
                if (node.parentCombine) {
                    node.parentCombine.removePort(port);
                    // eslint-disable-next-line
                    node.parentCombine.combines[bestNode].ports = _.filter(node.parentCombine.combines[bestNode].ports, p => p.id !== port.id)
                    // node.parentCombine.combines[bestNode].extras.choices.splice(i, 1);
                    // node.parentCombine.combines[bestNode].extras.inputs.splice(i, 1);
                }
                break;
            }
        }
        node.extras.choices.splice(i, 1);
        node.extras.inputs.splice(i, 1);
        if (node.parentCombine){
            node.parentCombine.combines[bestNode] = node.serialize()
        }
        this.setState({
            node: node
        }, this.props.onUpdate);
        this.props.repaint();
        e.preventDefault();
    }

    render() {
        return (
            <div>
                <div className="d-flex justify-content-between">
                    <label>
                        Choices
                    </label>
                </div>
                <div className={this.props.live_mode ? 'disabled-overlay' : null}>
                    <ChoiceInputs
                        choices={this.state.node.extras.choices}
                        inputs={this.state.node.extras.inputs}
                        onAdd={this.handleAddChoice}
                        onRemove={this.handleRemoveChoice}
                        onChange={this.handleChange}
                        live_mode={this.props.live_mode}
                    />
                </div>
            </div>
        );
    }
}

export default Choice;
