import React, {Component} from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import CanFulfill from './Canfulfill'
import { BUILT_IN_INTENTS_ALEXA } from 'Constants'
// import { Discovery } from 'aws-sdk';
import { intentHasSlots } from 'Helper'
import { FormGroup, Label, Alert } from 'reactstrap'
import { setError } from 'actions/modalActions'
import axios from 'axios'

const BUILT_INS = BUILT_IN_INTENTS_ALEXA.map(intent => {
    return {
        built_in: true,
        name: intent.name,
        key: intent.name,
        inputs: [{
            text: '',
            slots: intent.slots
        }]
    }
})

class DiscoverySettings extends Component{
    constructor(props){
        super(props)

        this.state = {
            add_intent: null
        }

        this.save = this.save.bind(this)
    }

    save(){
        axios.patch(`/skill/${this.props.skill.skill_id}?fulfillment=1`, {
            fulfillment: this.props.skill.fulfillment
        })
        .then(() => {
        })
        .catch(err => {
            this.props.setError('Error Saving Fulfillment')
        })
    }

    fulfillmentButtons(intents_sorted) {
        return intents_sorted.map((intent, i) => {
            if (this.props.skill.fulfillment[intent.key]) {
                return <button className="btn btn-clear btn-shadow w-100 my-2 d-flex space-between" key={i} onClick={() => {
                    this.props.history.push(`/settings/${this.props.skill.skill_id}/discovery/canfulfill/${intent.key}`)
                }} disabled={!intentHasSlots(intent)}>
                    <span className="slot-fulfillment"><i className="fas fa-comment-alt-check mr-2"></i>{intent.name}</span>
                </button>
            }
            return null
        })
    }

    render(){
        const fullfillment_intent_key = this.props.computedMatch.params ? this.props.computedMatch.params.id : null;

        const intents_sorted = _.orderBy(this.props.skill.intents.concat(BUILT_INS), ['name'], ['asc'])
        const fulfillment_intent = _.find(intents_sorted, { key: fullfillment_intent_key })

        return <React.Fragment>
            <div className="settings-content clearfix">
                <FormGroup>
                    <Label>CanFulfill Intent</Label>
                    <div className="helper-text mb-2">Set the slot fulfillment values that your skill is able to understand</div>
                    <hr />
                    {!fullfillment_intent_key && (
                        Object.keys(this.props.skill.fulfillment).length !== 0 ? 
                            <div className="selected-intent-label">
                                Select an Intent Below to Customize Slot Fulfillment
                            </div> :
                            <Alert className="text-center">
                                To add a CanFulfillIntent Handle, add an Intent Block in your Root Flow and enable the "CanFulfillIntent" toggle
                            </Alert>
                        )
                    }
                    {!fullfillment_intent_key && this.fulfillmentButtons(intents_sorted)}
                    {fullfillment_intent_key &&
                        <CanFulfill
                            slots={this.props.skill.slots}
                            fulfillment={this.props.skill.fulfillment}
                            selected_intent={fulfillment_intent}
                            history={this.props.history}
                            skill_id={this.props.skill.skill_id}
                            save={this.save}
                        />}
                </FormGroup>
                <div className="super-center">
                    {fullfillment_intent_key && <button className="btn btn-clear exit btn-thicc" onClick={() => {
                        this.props.history.push(`/settings/${this.props.skill.skill_id}/discovery`)
                    }}><i className="far fa-chevron-left"/> Back
                    </button>}
                </div>
            </div>
        </React.Fragment>
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setError: err => dispatch(setError(err))
    }
}
export default connect(null, mapDispatchToProps)(DiscoverySettings)