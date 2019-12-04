import cn from 'classnames';
import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';

import Button from '@/components/Button';
import SvgIcon from '@/components/SvgIcon';
import { EditPermissionContext } from '@/containers/CanvasV2/contexts';
import { ALEXA_STATES, publish } from '@/ducks/publish/alexa';

import { UploadButtonWrapper } from '../styled';
import VendorSelectList from './VendorSelectList';

function UploadButton(props) {
  const { stage, publish, vendors = [], setPopup } = props;
  const { isViewer } = React.useContext(EditPermissionContext);
  const state = ALEXA_STATES[stage];

  const [vendorsOpen, setVendorsOpen] = useState(false);
  // show dropdown list for vendors
  const multiVendor = vendors.length > 1 && state.end;

  const text = state.end ? 'Upload to Alexa' : 'Uploading';

  const action = () => (state.end ? publish() : setPopup((open) => !open));

  return (
    <UploadButtonWrapper options={multiVendor}>
      <Tooltip
        html={<div style={{ width: 180 }}>Test your Skill on your own Alexa device, or in the Alexa developer console</div>}
        position="bottom"
        distance={19}
        className={cn({ 'multi-vendor-tooltip': multiVendor })}
        disabled={vendorsOpen || isViewer}
      >
        {multiVendor ? (
          <Button disabled={isViewer} variant="contained" className="publish-btn multi-vendor-btn" onClick={action}>
            {text}
          </Button>
        ) : (
          <Button disabled={isViewer} variant="contained" className={cn('publish-btn', { 'spinning-publish': !state.end })} onClick={action}>
            {text}
            <div className="publish-spinner">
              <div className="spinner-icon">
                <SvgIcon icon="publishSpin" color="#fff" />
              </div>
            </div>
          </Button>
        )}
      </Tooltip>
      {multiVendor && (
        <button
          className={cn('vendor-dropdown', {
            active: vendorsOpen,
          })}
          onClick={() => setVendorsOpen((open) => !open)}
        >
          {' '}
        </button>
      )}
      {vendorsOpen && <VendorSelectList vendors={vendors} onBlur={() => setVendorsOpen(false)} />}
    </UploadButtonWrapper>
  );
}

export default connect(
  (state) => ({
    stage: state.publish.alexa.stage,
    vendors: _.get(state, ['account', 'amazon', 'vendors']),
  }),
  { publish }
)(UploadButton);
