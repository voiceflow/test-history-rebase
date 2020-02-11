import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';

import { GOOGLE_STATES, publish } from '@/ducks/publish/google';
import { EditPermissionContext } from '@/pages/Canvas/contexts';

import UploadButton from '../components/UploadButton';

function Upload(props) {
  const { stage, publish, setPopup } = props;
  const { isViewer } = React.useContext(EditPermissionContext);
  const state = GOOGLE_STATES[stage];

  const text = state.end ? 'Upload to Google' : 'Uploading';

  const action = () => (state.end ? publish() : setPopup((open) => !open));

  return (
    <Tooltip
      html={<div style={{ width: 180 }}>Test your Action on your own Google device, or in the Google Actions console</div>}
      position="bottom"
      distance={19}
      disabled={isViewer}
    >
      <UploadButton onClick={action} isUploading={!state.end}>
        {text}
      </UploadButton>
    </Tooltip>
  );
}

export default connect(
  (state) => ({
    stage: state.publish.google.stage,
  }),
  { publish }
)(Upload);
