import React from 'react';

import Box from '@/components/Box';
import Checkbox from '@/components/Checkbox';
import DropdownButton from '@/components/DropdownButton';
import Menu, { MenuItem } from '@/components/Menu';
import TippyTooltip from '@/components/TippyTooltip';
import { Permission } from '@/config/permissions';
import * as Account from '@/ducks/account';
import * as AlexaPublish from '@/ducks/publish/alexa';
import { connect } from '@/hocs';
import { usePermission } from '@/hooks';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import UploadButton from '../UploadButton';

const PartialMenu = Menu as React.ComponentType<Partial<React.ComponentProps<typeof Menu>>>;
const PartialMenuItem = MenuItem as React.ComponentType<Partial<React.ComponentProps<typeof MenuItem>>>;
const AnyDropdownButton = DropdownButton as React.ComponentType<any>;

type ButtonProps = {
  onClick: () => void;
  isActive: boolean;
  label?: string;
};

const Button: React.FC<ConnectedButtonProps & ButtonProps> = ({ vendors, vendorID, amazon, onClick, updateVendor, isActive, label }) => {
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  // show dropdown list for vendors
  const showVendors = vendors.length > 1 && !isActive;

  const needsLogin = !amazon;

  const buttonLabel = label || (needsLogin ? 'Connect to Alexa' : 'Upload to Alexa');

  const buttonIcon = isActive ? 'publishSpin' : 'rocket';

  return (
    <TippyTooltip
      html={<Box width={180}>Test your Skill on your own Alexa device, or in the Alexa developer console</Box>}
      position="bottom"
      disabled={!canEditCanvas}
    >
      {showVendors ? (
        <AnyDropdownButton
          id={Identifier.UPLOAD}
          menu={
            <PartialMenu>
              <PartialMenuItem disabled>Select Vendor</PartialMenuItem>
              <PartialMenuItem divider />

              {vendors.map(({ id, name }) => (
                <PartialMenuItem key={id} onClick={updateVendor}>
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
      ) : (
        <UploadButton icon={buttonIcon} id={Identifier.UPLOAD} onClick={onClick} isUploading={isActive}>
          {buttonLabel}
        </UploadButton>
      )}
    </TippyTooltip>
  );
};

const mapStateToProps = {
  amazon: Account.amazonAccountSelector,
  vendors: Account.amazonVendorsSelector,
  vendorID: AlexaPublish.vendorIdSelector,
};

const mapDispatchToProps = {
  updateVendor: AlexaPublish.updateVendor,
};

type ConnectedButtonProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Button) as React.FC<ButtonProps>;
