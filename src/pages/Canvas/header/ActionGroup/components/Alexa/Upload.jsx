import React from 'react';
import { Tooltip } from 'react-tippy';

import Checkbox from '@/components/Checkbox';
import DropdownButton from '@/components/DropdownButton';
import Menu, { MenuItem } from '@/components/Menu';
import { Permission } from '@/config/permissions';
import * as Account from '@/ducks/account';
import * as AlexaPublish from '@/ducks/publish/alexa';
import { connect } from '@/hocs';
import { usePermission } from '@/hooks';
import { Identifier } from '@/styles/constants';

import UploadButton from '../UploadButton';

function Upload({ stage, publish, vendors, setPopup, vendorID, amazon, updateVendor, label, options }) {
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const state = AlexaPublish.ALEXA_STATES[stage];

  // show dropdown list for vendors
  const multiVendor = vendors.length > 1 && state.end;

  const action = () => (state.end ? publish(options) : setPopup((open) => !open));

  const needsLogin = !amazon;
  const buttonIcon = needsLogin ? 'rocket' : 'publishSpin';

  const text = label ?? (needsLogin ? 'Connect to Alexa' : 'Upload to Alexa');

  return (
    <Tooltip
      html={<div style={{ width: 180 }}>Test your Skill on your own Alexa device, or in the Alexa developer console</div>}
      position="bottom"
      disabled={!canEditCanvas}
    >
      {multiVendor ? (
        <DropdownButton
          id={Identifier.UPLOAD}
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
        <UploadButton icon={buttonIcon} id={Identifier.UPLOAD} onClick={action} isUploading={!state.end}>
          {text}
        </UploadButton>
      )}
    </Tooltip>
  );
}

const mapStateToProps = {
  stage: AlexaPublish.publishStageSelector,
  vendors: Account.amazonVendorsSelector,
  vendorID: AlexaPublish.vendorIdSelector,
  amazon: Account.amazonAccountSelector,
};

const mapDispatchToProps = {
  publishStageSelector: AlexaPublish.publishStageSelector,
  publish: AlexaPublish.publish,
  updateVendor: AlexaPublish.updateVendor,
};

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
