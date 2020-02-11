import React from 'react';
import { Tooltip } from 'react-tippy';

import Checkbox from '@/components/Checkbox';
import DropdownButton from '@/components/DropdownButton';
import Menu, { MenuItem } from '@/components/Menu';
import { amazonVendorsSelector } from '@/ducks/account';
import { ALEXA_STATES, publish, publishStageSelector, updateVendor, vendorIdSelector } from '@/ducks/publish/alexa';
import { connect } from '@/hocs';
import { EditPermissionContext } from '@/pages/Canvas/contexts';

import UploadButton from '../components/UploadButton';

function Upload({ stage, publish, vendors, setPopup, vendorID, updateVendor }) {
  const { isViewer } = React.useContext(EditPermissionContext);
  const state = ALEXA_STATES[stage];

  // show dropdown list for vendors
  const multiVendor = vendors.length > 1 && state.end;

  const action = () => (state.end ? publish() : setPopup((open) => !open));

  const text = state.end ? 'Upload to Alexa' : 'Uploading';

  return (
    <Tooltip
      html={<div style={{ width: 180 }}>Test your Skill on your own Alexa device, or in the Alexa developer console</div>}
      position="bottom"
      disabled={isViewer}
    >
      {multiVendor ? (
        <DropdownButton
          buttonProps={{
            onClick: action,
          }}
          dropdownProps={{
            selfDismiss: true,
          }}
          menu={
            <Menu>
              <MenuItem disabled>Select Vendor</MenuItem>
              <MenuItem divider />
              {vendors.map(({ id, name }) => (
                <MenuItem key={id} onClick={() => updateVendor(id)}>
                  <Checkbox checked={vendorID === id} readOnly /> {name}
                </MenuItem>
              ))}
            </Menu>
          }
        >
          {text}
        </DropdownButton>
      ) : (
        <UploadButton onClick={action} isUploading={!state.end}>
          {text}
        </UploadButton>
      )}
    </Tooltip>
  );
}

const mapStateToProps = {
  stage: publishStageSelector,
  vendors: amazonVendorsSelector,
  vendorID: vendorIdSelector,
};

const mapDispatchToProps = {
  publishStageSelector,
  publish,
  updateVendor,
};

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
