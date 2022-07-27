import { Checkbox, Menu } from '@voiceflow/ui';
import React from 'react';

import DropdownButton from '@/components/DropdownButton';
import UploadButton from '@/components/PlatformUploadButton';
import * as Account from '@/ducks/account';
import * as ProjectV2 from '@/ducks/projectV2';
import { connect } from '@/hocs';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

const AnyDropdownButton = DropdownButton as React.ComponentType<any>;

interface AlexaUploadGroupButtonProps {
  onClick: () => void;
  isActive: boolean;
  label?: string;
}

const AlexaUploadGroupButton: React.FC<ConnectedButtonProps & AlexaUploadGroupButtonProps> = ({
  vendors,
  vendorID,
  amazon,
  onClick,
  isActive,
  label,
  selectVendor,
}) => {
  // show dropdown list for vendors
  const showVendors = vendors.length > 1 && !isActive;

  const needsLogin = !amazon;

  const buttonLabel = label || (needsLogin ? 'Connect to Alexa' : 'Upload to Alexa');

  return (
    <UploadButton
      tooltip="Test your Skill on your own Alexa device, or in the Alexa developer console"
      onClick={onClick}
      isActive={isActive}
      label={buttonLabel}
    >
      {showVendors && (
        <AnyDropdownButton
          id={Identifier.UPLOAD}
          menu={
            <Menu>
              <Menu.Item disabled>Select Vendor</Menu.Item>
              <Menu.Item divider />

              {vendors.map(({ id, name }) => (
                <Menu.Item key={id} onClick={() => selectVendor(id)}>
                  <Checkbox checked={vendorID === id} readOnly /> {name}
                </Menu.Item>
              ))}
            </Menu>
          }
          buttonProps={{
            onClick,
          }}
          dropdownProps={{ selfDismiss: true }}
        >
          {buttonLabel}
        </AnyDropdownButton>
      )}
    </UploadButton>
  );
};

const mapStateToProps = {
  amazon: Account.amazonAccountSelector,
  vendors: Account.amazonVendorsSelector,
  vendorID: ProjectV2.active.alexa.ownVendorIDSelector,
};

const mapDispatchToProps = {
  selectVendor: Account.amazon.selectVendor,
};

type ConnectedButtonProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(AlexaUploadGroupButton) as React.FC<AlexaUploadGroupButtonProps>;
