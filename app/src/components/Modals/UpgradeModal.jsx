import React, { Component } from 'react'
import {Modal, ModalBody, Row, Col} from 'reactstrap'
import { ModalHeader } from 'components/Modals/ModalHeader'
import {Elements} from 'react-stripe-elements';
import Button from 'components/Button'
import CheckoutForm from './../../pages/Account/CheckoutForm'
import "./../../pages/Account/Account.css";


const STATUS = {
  0: {name: "Community (Free)", price: "0"},
  1: {name: "Plus", price: "29"},
  30: {name: "Business", price: "199"},
  100: {name: "Admin", price: "100000000"}
}
const GET_STATUS = (status) => {
  if(status in STATUS){
    return STATUS[status]
  }else{
    return {name: 'Unknown', price: "0"}
  }
}

const options = [
    {
        plan: 1,
        name: "Plus",
        features: [
            "Intercom Support",
            "Voiceflow Emails",
            "Project Backups (5)",
            "In Skill Purchases",
            "Basic Analytics",
            "Multi-Platform Support (Google Assistant and Alexa)",
            "30,000 utterances/mo"
        ]
    },
    {
        plan: 30,
        name: "Business",
        features: [
            "Priority Business Support",
            "Voiceflow Emails",
            "Project Backups (50)",
            "In Skill Purchases",
            "Account Linking",
            "User Analytics",
            "Multi-Platform Support (Google Assistant and Alexa)",
            "Staging Environment"
        ]
    }
]

class UpgradeModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selected_plan: 1
        }

        this.switchPlan = this.switchPlan.bind(this)
        this.renderDescription = this.renderDescription.bind(this)
    }

    switchPlan(plan) {
        if(this.state.selected_plan !== plan) this.setState({selected_plan: plan})
    }

    renderDescription() {
        let option = options.find(o => o.plan === this.state.selected_plan)
        if (option) {
            return <div>
                {option.features.map((feature, i) => <div className="feature-item" key={i}><img src="/images/icons/circle_check.svg" width={18} className="mr-3" alt="check"/>{feature}</div>)}
            </div>
        }
        return null
    }

    render() {
        return <Modal isOpen={this.props.upgrade_modal} toggle={this.props.toggle} size="xl">
            <ModalHeader toggle={this.props.toggle} header='Upgrade Account' />
            <ModalBody>
                <Row className="py-md-4">
                <Col sm="3">
                    <span className="text-muted">Plan</span>
                    {options.map((option, i) => {
                    return <Button key={i}
                        isClear={this.state.selected_plan !== option.plan}
                        disabled={this.state.selected_plan === option.plan}
                        onClick={()=>{this.switchPlan(option.plan)}}
                        block
                        className="mt-2">
                        {option.name}
                        </Button>
                    })}
                </Col>
                <Col sm="4" className="border-left">
                    <span className="text-muted">Description</span>
                    {this.renderDescription()}
                </Col>
                <Col sm="5" className="border-left">
                    <div className="text-muted">Payment</div>
                    <Elements>
                    <CheckoutForm user={this.props.user} plan={GET_STATUS(this.state.selected_plan)} selected={this.state.selected_plan} logout={this.props.logout} switchPlan={this.switchPlan}/>
                    </Elements>
                </Col>
                </Row>
            </ModalBody>
        </Modal>
  }
}

export default UpgradeModal;
