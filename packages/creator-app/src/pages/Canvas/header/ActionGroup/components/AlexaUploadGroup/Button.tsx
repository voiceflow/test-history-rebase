import { Menu, MenuItem } from '@voiceflow/ui';
import React from 'react';

import Checkbox from '@/components/Checkbox';
import DropdownButton from '@/components/DropdownButton';
import * as Account from '@/ducks/account';
import * as ProjectV2 from '@/ducks/projectV2';
import { connect } from '@/hocs';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import UploadButton from '../UploadButton';

const PartialMenu = Menu as React.ComponentType<Partial<React.ComponentProps<typeof Menu>>>;
const PartialMenuItem = MenuItem as React.ComponentType<Partial<React.ComponentProps<typeof MenuItem>>>;
const AnyDropdownButton = DropdownButton as React.ComponentType<any>;

interface ButtonProps {
  onClick: () => void;
  isActive: boolean;
  label?: string;
}

const Button: React.FC<ConnectedButtonProps & ButtonProps> = ({ vendors, vendorID, amazon, onClick, isActive, label, activateVendor }) => {
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
            <PartialMenu>
              <PartialMenuItem disabled>Select Vendor</PartialMenuItem>
              <PartialMenuItem divider />

              {vendors.map(({ id, name }) => (
                <PartialMenuItem key={id} onClick={() => activateVendor(id)}>
                  <Checkbox checked={vendorID === id} readOnly /> {name}
                </PartialMenuItem>
              ))}
            </PartialMenu>
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
  activateVendor: Account.amazon.activateVendor,
};

type ConnectedButtonProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Button) as React.FC<ButtonProps>;
