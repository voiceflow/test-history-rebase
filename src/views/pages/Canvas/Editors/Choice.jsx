import React, { Component } from 'react';
import { connect } from 'react-redux'
import _ from 'lodash';
import ChoiceInputs from './components/ChoiceInputs';
import randomstring from 'randomstring'

export class Choice extends Component {
    constructor(props) {
        super(props);

        // ensure choices/inputs maintain consistency (this is done for backwards compatiability)
        if(!Array.isArray(props.node.extras.choices) || props.node.extras.choices.length !== props.node.extras.inputs.length){
            props.node.extras.choices = new Array(props.node.extras.inputs.length).fill(null)
        }

        props.node.extras.choices = props.node.extras.choices.map(c => (c && c.key) ? c : {
            open: false,
            key: randomstring.generate(5)
        })

        this.state = {
            node: props.node,
            voices: Array.isArray(this.props.voices) ? this.props.voices : []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleAddChoice = this.handleAddChoice.bind(this);
        this.handleRemoveChoice = this.handleRemoveChoice.bind(this);
    }

    handleChange(text, key) {
        var node = this.state.node
        node.extras.inputs[key] = text
        if (node.parentCombine) {
            let bestNode = _.findIndex(
                node.parentCombine.combines,
                npc => npc.id === node.id
            );
            node.parentCombine.combines[bestNode] = node
        }
        this.setState({
            node: node
        }, this.props.onUpdate);
        this.props.repaint();
    }

    handleAddChoice() {
        // console.log(this.state.node.extras.choices);
        var node = this.state.node;
        this.props.clearRedo();
        this.props.updateEvents(_.cloneDeep(node).extras, _.cloneDeep(node).ports)
        node.extras.inputs.push('');
        node.extras.choices.push({
            open: true,
            key: randomstring.generate(5)
        })
        let test = node.addOutPort(node.extras.inputs.length);
        test.setMaximumLinks(1);
        if (node.parentCombine) {
            let bestNode = _.findIndex(node.parentCombine.combines, npc => npc.id === node.id)
            node.parentCombine.combines[bestNode] = node

        }
        this.setState({
            node: node
        }, this.props.onUpdate)
        // this.props.diagramEngine.setSuperSelect(node.parentCombine);
        this.props.repaint()
    }

    handleRemoveChoice(i) {
        var node = this.state.node;
        this.props.clearRedo();
        this.props.updateEvents(_.cloneDeep(node).extras, _.cloneDeep(node).ports);
        let bestNode;
        if (node.parentCombine) {
            bestNode = _.findIndex(node.parentCombine.combines, npc => npc.id === node.id)
        }
        for (var name in node.getPorts()) {
            var port = node.getPort(name);

            if (port.label === node.extras.inputs.length) {
                node.removePort(port);
                break;
            }
        }
        node.extras.choices.splice(i, 1)
        node.extras.inputs.splice(i, 1)
        if (node.parentCombine){
            node.parentCombine.combines[bestNode] = node
        }
        this.setState({
            node: node
        }, this.props.onUpdate);
        this.props.repaint();
    }

    render() {
        return (
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
        );
    }
}

const mapStateToProps = state => ({
    live_mode: state.skills.live_mode
})
export default connect(mapStateToProps)(Choice);
