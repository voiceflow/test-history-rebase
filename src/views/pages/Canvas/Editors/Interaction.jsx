import React, { Component } from 'react'
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
        const extras = node.extras[this.props.platform]
        extras.choices = choices

        this.setState({
            node: node
        })
        this.props.onUpdate()
    }

    handleAddChoice() {
        const node = this.state.node
        const g_extras = node.extras.google
        const a_extras = node.extras.alexa

        const g_choices = g_extras.choices
        const a_choices = a_extras.choices

        const key = randomstring.generate(12)

        g_choices.push({intent: null, mappings: [], key: key, open: true})
        a_choices.push({intent: null, mappings: [], key: key, open: true})

        let test = node.addOutPort(a_choices.length);
        test.setMaximumLinks(1);

        this.setState({
            node: node
        })
        this.props.onUpdate()
        this.props.repaint()
    }

    handleRemoveChoice(i) {
        const node = this.state.node
        const g_extras = node.extras.google
        const a_extras = node.extras.alexa

        const g_choices = g_extras.choices
        const a_choices = a_extras.choices

        for (var name in node.getPorts()) {
            var port = node.getPort(name)

            if (port.label === a_choices.length) {
                node.removePort(port)
                break
            }
        }

        a_choices.splice(i, 1)
        g_choices.splice(i, 1)

        this.setState({
            node: node,
        })
        this.props.onUpdate()
        this.props.repaint()
    }

    renderTab(){

        const node = this.state.node
        const extras = node.extras[this.props.platform]

        switch(this.state.tab){
            case 'choices':
                return <React.Fragment>
                    <label>
                        Choices
                    </label>
                    <ChoiceDropdownInputs
                        choices={extras.choices}
                        onAdd={this.handleAddChoice}
                        onRemove={this.handleRemoveChoice}
                        onChange={this.handleChoicesChange}
                        intents={this.props.intents}
                        variables={this.props.variables}
                        slots = {this.props.slots}
                        built_ins={this.props.built_ins}
                        onError={this.props.onError}
                        update={this.update}
                        platform={this.props.platform}
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
                        platform={this.props.platform}
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
                        platform={this.props.platform}
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
