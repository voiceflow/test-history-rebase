import { ModalHeader } from 'components/Modals/ModalHeader';
import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody } from 'reactstrap';

import { clearHelp } from '../../ducks/alerts';

class Alerts extends React.Component {
  render() {
    const { showHelp, helpHeader, helpMessage, helpLink, helpVideo } = this.props;

    return (
      <div>
        <Modal isOpen={showHelp} toggle={() => clearHelp()}>
          <ModalHeader header={helpHeader} toggle={() => clearHelp()} />
          <ModalBody>
            <div className="text-muted pl-3 pr-3 pb-3 pt-0">
              <React.Fragment>
                <p className="mb-4">{helpMessage}</p>
                {helpLink && (
                  <a href={helpLink} rel="noopener noreferrer" target="_blank" className="btn-link">
                    See More
                  </a>
                )}
                {helpVideo && (
                  <div className="embed-responsive box-shadow embed-responsive-16by9 rounded mt-4">
                    <iframe src={helpVideo} allowFullScreen title="intro" />
                  </div>
                )}
              </React.Fragment>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  showHelp: state.alerts.showHelp,
  helpHeader: state.alerts.help.header,
  helpMessage: state.alerts.help.message,
  helpLink: state.alerts.help.link,
  helpVideo: state.alerts.help.video,
});

export default connect(
  mapStateToProps,
  { clearHelp }
)(Alerts);
