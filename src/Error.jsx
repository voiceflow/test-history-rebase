import Button from 'components/Button';
import React, { PureComponent } from 'react';
import { Alert, Modal } from 'reactstrap';

class ErrorScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.renderError = this.renderError.bind(this);
  }

  renderError() {
    switch (this.props.error.type) {
      case 'socket-fail':
        return (
          <div className="text-center">
            <img className="login-logo mb-5" src="/logo.png" alt="logo" />
            <h5 className="text-muted mb-4">Lost Connection to Voiceflow Sessions</h5>
            <Alert className="mb-4">
              We won't be able to verify if there are other sessions logged on to this account - This may cause save issues if different sessions save
              over each other
            </Alert>
            <Button isPrimary isBtn onClick={this.props.error.action}>
              Continue Anyway
            </Button>
          </div>
        );
      case 'socket-used':
        return (
          <div className="text-center">
            <img className="login-logo mb-4" src="/logo.png" alt="logo" />
            <h5 className="text-muted">This Account is currently in use in another session</h5>
            <p className="d-block mb-4">(You may have another Browser Tab open)</p>
            <Alert color="danger">This may cause project save issues if different sessions save over each other</Alert>
            <Alert className="text-left pb-3">
              <u>Open Session Details</u>
              <br />
              <b>IP:</b> {this.props.error.data.ip} <br />
              <b>Browser:</b> {this.props.error.data.device.browser} <br />
              <b>OS:</b> {this.props.error.data.device.os}
              <hr />
              <b>> If all other sessions are closed wait briefly and refresh this page</b>
            </Alert>
          </div>
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <Modal isOpen={true} centered size="lg">
        <div className="p-5">{this.renderError()}</div>
      </Modal>
    );
  }
}

export default ErrorScreen;
