import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import Storage from 'utils/storage';

import Icon from '../Icon';
import Modal from '../Modal';
import Button from '../Button';
import Checkbox from '../Checkbox';

export default class SentOnReviewModal extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['custom-skill', 'flash-briefing']).isRequired,
    canBeShown: PropTypes.bool.isRequired,
  };

  state = {
    opened: !Storage.get(`${this.props.type}:show-sent-on-review-modal`),
    dontShowAgain: !!Storage.get(`${this.props.type}:show-sent-on-review-modal`),
  };

  onCancel = () => {
    const { type } = this.props;
    const { dontShowAgain } = this.state;

    if (dontShowAgain) {
      Storage.set(`${type}:show-sent-on-review-modal`, dontShowAgain);
    }

    this.setState({ opened: false });
  };

  onChangeDontShowAgain = () => {
    this.setState(({ dontShowAgain }) => ({ dontShowAgain: !dontShowAgain }));
  };

  renderBody = () => {
    return (
      <div className="initial-block-info __centered">
        <div className="initial-block-info__image">
          <Icon isBig className="published" />
        </div>

        <div className="initial-block-info__description">
          Your skill has been submitted for review. <br />
          During this time you will see the skill with the "Review" status.
        </div>
      </div>
    );
  };

  renderHeader = () => {
    return <h2 className="modal-title">SENT ON REVIEW</h2>;
  };

  renderFooter = () => {
    const { dontShowAgain } = this.state;

    return (
      <Fragment>
        <div className="modal-footer-left">
          <div className="form-control-static">
            <Checkbox
              label="Don't Show Again"
              checked={dontShowAgain}
              onChange={this.onChangeDontShowAgain}
            />
          </div>
        </div>

        <div className="modal-footer-right">
          <Button onClick={this.onCancel} isFlat>
            Close
          </Button>
        </div>
      </Fragment>
    );
  };

  render() {
    const { opened } = this.state;
    const { canBeShown } = this.props;

    return (
      <Modal
        show={canBeShown && opened}
        onHide={this.onCancel}
        renderBody={this.renderBody}
        withBigIcon
        renderHeader={this.renderHeader}
        renderFooter={this.renderFooter}
      />
    );
  }
}
