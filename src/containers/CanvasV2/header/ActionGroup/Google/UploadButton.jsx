import cn from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';

import Button from '@/components/Button';
import SvgIcon from '@/components/SvgIcon';
import { GOOGLE_STATES, publish } from '@/ducks/publish/google';

import { UploadButtonWrapper } from '../styled';

function UploadButton(props) {
  const { stage, publish, setPopup } = props;
  const state = GOOGLE_STATES[stage];

  const text = state.end ? 'Upload to Google' : 'Uploading';

  const action = () => (state.end ? publish() : setPopup((open) => !open));

  return (
    <UploadButtonWrapper>
      <Tooltip
        html={<div style={{ width: 180 }}>Test your Action on your own Google device, or in the Google Actions console</div>}
        position="bottom"
        distance={19}
      >
        <Button variant="contained" className={cn('publish-btn', { 'spinning-publish': !state.end })} onClick={action}>
          {text}
          <div className="publish-spinner">
            <div className="spinner-icon">
              <SvgIcon icon="publishSpin" color="#fff" />
            </div>
          </div>
        </Button>
      </Tooltip>
    </UploadButtonWrapper>
  );
}

export default connect(
  (state) => ({
    stage: state.publish.google.stage,
  }),
  { publish }
)(UploadButton);
