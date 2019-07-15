import cn from 'classnames';
import React, { Component } from 'react';
import { Tooltip } from 'react-tippy';

import Button from '@/components/Button';

import VendorSelectList from '../VendorSelectList/VendorSelectList';

class UploadButton extends Component {
  render() {
    const {
      live_mode,
      openUpdateLive,
      toggle_upload_prompt,
      isUploadLoading,
      platform,
      vendors,
      vendors_open,
      openUpdate,
      toggleVendors,
      project_id,
    } = this.props;

    if (live_mode) {
      return (
        <Tooltip html={<div style={{ width: 155 }}>Update your live version with your local changes</div>} position="bottom" distance={16}>
          <Button variant="contained" className="publish-btn" onClick={openUpdateLive}>
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
    if (isUploadLoading()) {
      return (
        <Button variant="contained" className="publish-btn" onClick={() => toggle_upload_prompt()}>
          <p className="loading-btn m-0 p-0">Uploading</p>
          <div className="launch">
            <div className="load-spinner pt-1">
              <span className="save-loader-white" />
            </div>
          </div>
        </Button>
      );
    }
    const multiVendor = platform === 'alexa' && vendors && vendors.length > 1;
    return (
      <div className={cn('upload-btn-container', { 'multi-vendor': multiVendor })}>
        <Tooltip
          html={
            <div style={{ width: 180 }}>
              {platform === 'google'
                ? 'Test your Action on your own Google device, or in the Google Actions console'
                : 'Test your Skill on your own Alexa device, or in the Alexa developer console'}
            </div>
          }
          position="bottom"
          distance={16}
          className={cn({ 'multi-vendor-tooltip': multiVendor })}
          disabled={vendors_open}
        >
          {multiVendor ? (
            <Button variant="contained" className="publish-btn multi-vendor-btn" onClick={openUpdate}>
              {platform === 'google' ? 'Upload to Google' : 'Upload to Alexa'}
            </Button>
          ) : (
            <Button variant="contained" className="publish-btn" onClick={openUpdate}>
              {platform === 'google' ? 'Upload to Google' : 'Upload to Alexa'}
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
              active: vendors_open,
            })}
            onClick={toggleVendors}
          >
            {' '}
          </div>
        )}
        {vendors_open && <VendorSelectList vendors={vendors} onBlur={toggleVendors} project_id={project_id} />}
      </div>
    );
  }
}

export default UploadButton;
