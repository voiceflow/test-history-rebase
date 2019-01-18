import React, { PureComponent } from 'react'
import {Modal, Alert} from 'reactstrap'

class ErrorScreen extends PureComponent {
    constructor(props){
        super(props)
        this.renderError = this.renderError.bind(this)
    }

    renderError(){
        switch(this.props.error.type){
            case 'socket-fail':
                return <div className="text-center">
                    <h5 className="text-muted mb-5">Unable to connect to Voiceflow</h5>
                    <Alert>
                        Try Refreshing or Contact Us
                    </Alert>
                </div>
            case 'socket-used':
                return <div className="text-center">
                    <img className="login-logo mb-5" src="/logo.svg" alt="logo"/>
                    <h5 className="text-muted">This Account is currently in use in another session</h5>
                    <p className="d-block mb-5">(You may have another Browser Tab open)</p>
                    <Alert className="text-left">
                        <u>Open Session Details</u><br/>
                        <b>IP:</b> {this.props.error.data.ip} <br/>
                        <b>Browser:</b> {this.props.error.data.device.browser} <br/>
                        <b>OS:</b> {this.props.error.data.device.os} <br/>
                    </Alert>
                </div>
            default:
                return null
        }
    }

    render() {
        return <Modal isOpen={true} centered size="lg">
            <div className="p-5">
                {this.renderError()}
            </div>
        </Modal>
    }
}

export default ErrorScreen
