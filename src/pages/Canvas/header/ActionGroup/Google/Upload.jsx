import React from 'react';
import { Tooltip } from 'react-tippy';

import * as Account from '@/ducks/account';
import { GOOGLE_STATES } from '@/ducks/publish/google';
import * as GooglePublish from '@/ducks/publish/google';
import { connect } from '@/hocs';
import { EditPermissionContext } from '@/pages/Skill/contexts';
import { Identifier } from '@/styles/constants';

import UploadButton from '../components/UploadButton';

function Upload(props) {
  const { stage, publish, setPopup, google } = props;
  const { isViewer } = React.useContext(EditPermissionContext);
  const state = GOOGLE_STATES[stage];
  const needsLogin = !google;
  const buttonIcon = needsLogin ? 'rocket' : 'publishSpin';

  let text = 'Upload to Google';
  if (needsLogin) {
    text = 'Connect to Google';
  }

  const action = () => (state.end ? publish() : setPopup((open) => !open));

  return (
    <Tooltip
      html={<div style={{ width: 180 }}>Test your Action on your own Google device, or in the Google Actions console</div>}
      position="bottom"
      distance={19}
      disabled={isViewer}
    >
      <UploadButton icon={buttonIcon} id={Identifier.UPLOAD} onClick={action} isUploading={!state.end}>
        {text}
      </UploadButton>
    </Tooltip>
  );
}

const mapStateToProps = {
  stage: GooglePublish.publishStageSelector,
  google: Account.googleAccountSelector,
};

const mapDispatchToProps = {
  publish: GooglePublish.publish,
};

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
