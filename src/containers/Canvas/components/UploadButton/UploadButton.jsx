import cn from 'classnames';
import Button from 'components/Button';
import React, { Component } from 'react';
import { Tooltip } from 'react-tippy';

import VendorSelectList from '../VendorSelectList/VendorSelectList';

class UploadButton extends Component {
  render() {
    if (this.props.live_mode) {
      return (
        <Tooltip html={<div style={{ width: 155 }}>Update your live version with your local changes</div>} position="bottom" distance={16}>
          <Button variant="contained" className="publish-btn" onClick={this.props.openUpdateLive}>
            Update Live{' '}
            <div className="launch">
              <div className="first">
                <img src="/up.svg" alt="upload" width="16" height="16" />
              </div>
              <div className="second">
                <img src="/rocket.svg" alt="check" width="16" height="16" />
              </div>
            </div>
          </Button>
        </Tooltip>
      );
    }
    if (this.props.isUploadLoading()) {
      return (
        <Button variant="contained" className="publish-btn" onClick={() => this.props.toggle_upload_prompt()}>
          <p className="loading-btn m-0 p-0">Uploading</p>
          <div className="launch">
            <div className="load-spinner pt-1">
              <span className="save-loader-white" />
            </div>
          </div>
        </Button>
      );
    }
    const multiVendor = this.props.platform === 'alexa' && this.props.vendors && this.props.vendors.length > 1;
    return (
      <div className={cn('upload-btn-container', { 'multi-vendor': multiVendor })}>
        <Tooltip
          html={
            <div style={{ width: 180 }}>
              {this.props.platform === 'google'
                ? 'Test your Action on your own Google device, or in the Google Actions console'
                : 'Test your Skill on your own Alexa device, or in the Alexa developer console'}
            </div>
          }
          position="bottom"
          distance={16}
          className={cn({ 'multi-vendor-tooltip': multiVendor })}
          disabled={this.props.vendors_open}
        >
          {multiVendor ? (
            <Button variant="contained" className="publish-btn multi-vendor-btn" onClick={this.props.openUpdate}>
              {this.props.platform === 'google' ? 'Upload to Google' : 'Upload to Alexa'}
            </Button>
          ) : (
            <Button variant="contained" className="publish-btn" onClick={this.props.openUpdate}>
              {this.props.platform === 'google' ? 'Upload to Google' : 'Upload to Alexa'}
              <div className="launch">
                <div className="first">
                  <img src="/up.svg" alt="upload" width="15" height="15" />
                </div>
                <div className="second">
                  <img src="/check-white.svg" alt="check" width="15" height="15" />
                </div>
              </div>
            </Button>
          )}
        </Tooltip>
        {multiVendor && (
          <div
            className={cn('vendor-dropdown', {
              active: this.props.vendors_open,
            })}
            onClick={this.props.toggleVendors}
          >
            {' '}
          </div>
        )}
        {this.props.vendors_open && (
          <VendorSelectList vendors={this.props.vendors} onBlur={this.props.toggleVendors} project_id={this.props.project_id} />
        )}
      </div>
    );
  }
}

export default UploadButton;
