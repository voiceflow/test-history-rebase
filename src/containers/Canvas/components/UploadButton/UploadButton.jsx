import cn from 'classnames';
import React, { Component } from 'react';
import { Tooltip } from 'react-tippy';

import Button from '@/components/Button';
import SvgIcon from '@/components/SvgIcon';

import VendorSelectList from '../VendorSelectList/VendorSelectList';
import UploadButtonWrapper from './UploadButtonWrapper';

class UploadButton extends Component {
  state = {
    openVendors: false,
  };

  render() {
    const { isUploadLoading, vendors, platform, project_id } = this.props;
    const multiVendor = platform === 'alexa' && vendors && vendors.length > 1;

    return (
      <UploadButtonWrapper multiVendor={multiVendor} isGoogle={platform === 'google'}>
        <Tooltip
          html={<div style={{ width: 180 }}>{this.renderTooltipText()}</div>}
          position="bottom"
          distance={16}
          className={cn({ 'multi-vendor-tooltip': multiVendor })}
          disabled={this.state.openVendors}
        >
          {multiVendor ? (
            <Button variant="contained" className="publish-btn multi-vendor-btn" onClick={this.onButtonClick}>
              {this.renderButtonText()}
            </Button>
          ) : (
            <Button variant="contained" className={cn('publish-btn', { 'spinning-publish': isUploadLoading })} onClick={this.onButtonClick}>
              {this.renderButtonText()}
              <div className="publish-spinner">
                <div className="spinner-icon">
                  <SvgIcon icon="publishSpin" color="#fff" />
                </div>
              </div>
            </Button>
          )}
        </Tooltip>
        {multiVendor && (
          <div
            className={cn('vendor-dropdown', {
              active: this.state.openVendors,
            })}
            onClick={this.toggleVendors}
          >
            {' '}
          </div>
        )}
        {this.state.openVendors && <VendorSelectList vendors={vendors} onBlur={this.toggleVendors} project_id={project_id} />}
      </UploadButtonWrapper>
    );
  }

  toggleVendors = (e) => {
    e.preventDefault();
    this.setState({ openVendors: !this.state.openVendors });
  };

  onButtonClick = () => {
    const { isUploadLoading, toggle_upload_prompt, openUpdate, openUpdateLive, live_mode } = this.props;

    if (live_mode) {
      openUpdateLive();
    }

    if (isUploadLoading) {
      toggle_upload_prompt();
    } else {
      openUpdate();
    }
  };

  renderButtonText = () => {
    const { platform, live_mode } = this.props;

    if (live_mode) {
      return 'Update Live';
    }
    return platform === 'google' ? 'Upload to Google' : 'Upload to Alexa';
  };

  renderTooltipText = () => {
    const { live_mode, platform } = this.props;

    if (live_mode) return 'Update your live version with your local changes';
    if (platform === 'google') {
      return 'Test your Action on your own Google device, or in the Google Actions console';
    }
    return 'Test your Skill on your own Alexa device, or in the Alexa developer console';
  };
}

export default UploadButton;
