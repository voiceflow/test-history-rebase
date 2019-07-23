import cn from 'classnames';
import React, { Component } from 'react';
import { Tooltip } from 'react-tippy';

import Button from '@/components/Button';
import SvgIcon from '@/components/SvgIcon';
import PublishSpinnerIcon from '@/svgs/publish-spin.svg';

import VendorSelectList from '../VendorSelectList/VendorSelectList';
import UploadButtonWrapper from './UploadButtonWrapper';

class UploadButton extends Component {
  onButtonClick = () => {
    const { isUploadLoading, toggle_upload_prompt, openUpdate, openUpdateLive, live_mode } = this.props;
    if (live_mode) {
      openUpdateLive();
    }
    const spin = isUploadLoading();
    if (spin) {
      toggle_upload_prompt();
    } else {
      openUpdate();
    }
  };

  renderButtonText = () => {
    const { isUploadLoading, platform, live_mode } = this.props;

    if (live_mode) {
      return 'Update Live';
    }

    if (!isUploadLoading()) {
      return platform === 'google' ? 'Upload to Google' : 'Upload to Alexa';
    }
    return 'Uploading';
  };

  renderTooltipText = () => {
    const { live_mode, platform } = this.props;

    if (live_mode) return 'Update your live version with your local changes';
    if (platform === 'google') {
      return 'Test your Action on your own Google device, or in the Google Actions console';
    }
    return 'Test your Skill on your own Alexa device, or in the Alexa developer console';
  };

  render() {
    const { isUploadLoading, platform, vendors, vendors_open, toggleVendors, project_id } = this.props;

    const multiVendor = platform === 'alexa' && vendors && vendors.length > 1;
    return (
      <UploadButtonWrapper multiVendor={multiVendor} isGoogle={platform === 'google'}>
        <Tooltip
          html={<div style={{ width: 180 }}>{this.renderTooltipText()}</div>}
          position="bottom"
          distance={16}
          className={cn({ 'multi-vendor-tooltip': multiVendor })}
          disabled={vendors_open}
        >
          {multiVendor ? (
            <Button variant="contained" className="publish-btn multi-vendor-btn" onClick={this.onButtonClick}>
              {platform === 'google' ? 'Upload to Google' : 'Upload to Alexa'}
            </Button>
          ) : (
            <Button variant="contained" className={cn('publish-btn', { 'spinning-publish': isUploadLoading() })} onClick={this.onButtonClick}>
              {this.renderButtonText()}
              <div className="publish-spinner">
                <div className="spinner-icon">
                  <SvgIcon icon={PublishSpinnerIcon} color="#fff" />
                </div>
              </div>
            </Button>
          )}
        </Tooltip>
        {multiVendor && (
          <div
            className={cn('vendor-dropdown', {
              active: vendors_open,
            })}
            onClick={toggleVendors}
          >
            {' '}
          </div>
        )}
        {vendors_open && <VendorSelectList vendors={vendors} onBlur={toggleVendors} project_id={project_id} />}
      </UploadButtonWrapper>
    );
  }
}

export default UploadButton;
