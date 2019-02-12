import React, { Component } from 'react'
import _ from 'lodash'
import IntentInputs from './components/IntentInputs'
import SlotInputs from './components/SlotInputs'
import { Button, ButtonGroup } from 'reactstrap'
import ChoiceDropdownInputs from './components/ChoiceDropdownInputs'
import randomstring from 'randomstring'

class Interaction extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            node: this.props.node,
            tab: 'choices'
        }
        
        this.handleChoicesChange = this.handleChoicesChange.bind(this)
        this.handleAddChoice = this.handleAddChoice.bind(this)
        this.handleRemoveChoice = this.handleRemoveChoice.bind(this)
        this.renderTab = this.renderTab.bind(this)

        this.update = this.update.bind(this)
    }

    update(){
        this.forceUpdate()
        this.props.onUpdate()
    }

    handleChoicesChange(choices) {
        const node = this.state.node
        node.extras.choices = choices

        this.setState({
            node: node
        })
        this.props.onUpdate()
    }

    handleAddChoice(e) {
        var node = this.state.node
        const choices = node.extras.choices

        choices.push({intent: null, mappings: [], key: randomstring.generate(12), open: true})

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
        e.preventDefault()
    }

    handleRemoveChoice(i) {
        const node = this.state.node;
        const choices = node.extras.choices
        let bestNode;
        if (node.parentCombine){
            bestNode = _.findIndex(node.parentCombine.combines, npc => npc.name === node.name)
        }
        for (var name in node.getPorts()) {
            var port = node.getPort(name)

            if (port.label === node.extras.choices.length) {
                node.removePort(port)
                if (node.parentCombine && bestNode >= 0) {
                    node.parentCombine.removePort(port);
                    // eslint-disable-next-line
                    node.parentCombine.combines[bestNode].ports = _.filter(node.parentCombine.combines[bestNode].ports, p => p.id !== port.id)
                    node.parentCombine.combines[bestNode].extras.choices.splice(i,1);
                }
                break
            }
        }

        choices.splice(i, 1)

        this.setState({
            node: node,
        })
        this.props.onUpdate()
        this.props.repaint()
    }

    renderTab(){
        switch(this.state.tab){
            case 'choices':
                return <React.Fragment>
                    <label>
                        Choices
                    </label>
                    <ChoiceDropdownInputs
                        choices={this.state.node.extras.choices}
                        onAdd={this.handleAddChoice}
                        onRemove={this.handleRemoveChoice}
                        onChange={this.handleChoicesChange}
                        intents={this.props.intents}
                        variables={this.props.variables}
                        slots = {this.props.slots}
                        built_ins={this.props.built_ins}
                        onError={this.props.onError}
                        update={this.update}
                    />
                </React.Fragment>
            case 'intents':
                return <React.Fragment>
                    <label>
                        Intents
                    </label>
                    <IntentInputs
                        intents={this.props.intents}
                        onAdd={this.props.handleAddIntent}
                        onRemove={this.props.handleRemoveIntent}
                        slots={this.props.slots}
                        onError={this.props.onError}
                        update={this.update}
                        onConfirm={this.props.onConfirm}
                    />
                </React.Fragment>
            case 'slots':
                return <React.Fragment>
                    <label>
                        Slots
                    </label>
                    <SlotInputs
                        intents={this.props.intents}
                        slots={this.props.slots}
                        slot_types={this.props.slot_types}
                        onError={this.props.onError}
                        update={this.update}
                    />
                </React.Fragment>
            default:
                return null
        }
    }

    render() {
        return (
            <React.Fragment>
                <ButtonGroup className="toggle-group mb-2">
                    <Button outline={this.state.tab !== 'choices'} onClick={() => {this.setState({tab: 'choices'})}} disabled={this.state.tab === 'choices'}> Choices </Button>
                    <Button outline={this.state.tab !== 'intents'} onClick={() => {this.setState({tab: 'intents'})}} disabled={this.state.tab === 'intents'}> Intents </Button>
                    <Button outline={this.state.tab !== 'slots'} onClick={() => {this.setState({tab: 'slots'})}} disabled={this.state.tab === 'slots'}> Slots </Button>
                </ButtonGroup>
                {this.renderTab()}
            </React.Fragment>
        );
    }
}

export default Interaction;
