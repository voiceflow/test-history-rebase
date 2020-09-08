import React from 'react';

import Box from '@/components/Box';
import Checkbox from '@/components/Checkbox';
import DropdownButton from '@/components/DropdownButton';
import Menu, { MenuItem } from '@/components/Menu';
import TippyTooltip from '@/components/TippyTooltip';
import { Permission } from '@/config/permissions';
import { JobStatus } from '@/constants';
import * as Account from '@/ducks/account';
import * as AlexaPublish from '@/ducks/publish/alexa';
import { connect } from '@/hocs';
import { usePermission } from '@/hooks';
import { ExportContext, PublishContext } from '@/pages/Skill/contexts';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import UploadButton from '../UploadButton';

const PartialMenu = Menu as React.ComponentType<Partial<React.ComponentProps<typeof Menu>>>;
const PartialMenuItem = MenuItem as React.ComponentType<Partial<React.ComponentProps<typeof MenuItem>>>;
const AnyDropdownButton = DropdownButton as React.ComponentType<any>;

type ButtonProps = {
  export?: boolean;
  onClick: () => void;
};

const Button: React.FC<ConnectedButtonProps & ButtonProps> = ({ vendors, vendorID, amazon, onClick, updateVendor, export: isExport }) => {
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const publishContext = React.useContext(PublishContext)!;
  const exportContext = React.useContext(ExportContext)!;

  // show dropdown list for vendors
  const multiVendor = vendors.length > 1;

  const needsLogin = !amazon;

  const buttonIcon = needsLogin ? 'rocket' : 'publishSpin';
  const buttonLabel = (isExport && 'Export') || (needsLogin ? 'Connect to Alexa' : 'Upload to Alexa');

  const job = isExport ? exportContext.job : publishContext.job;

  const exportOrPublish = () => {
    if (isExport) {
      exportContext.export();
    } else {
      publishContext.publish();
    }
  };

  const onPublishVendor = async (nextVendorID: string) => {
    onClick();

    await updateVendor(nextVendorID);

    exportOrPublish();
  };

  const onPublish = () => {
    onClick();

    exportOrPublish();
  };

  return (
    <TippyTooltip
      html={<Box width={180}>Test your Skill on your own Alexa device, or in the Alexa developer console</Box>}
      position="bottom"
      disabled={!canEditCanvas}
    >
      {multiVendor ? (
        <AnyDropdownButton
          id={Identifier.UPLOAD}
          menu={
            <PartialMenu>
              <PartialMenuItem disabled>Select Vendor</PartialMenuItem>
              <PartialMenuItem divider />

              {vendors.map(({ id, name }) => (
                <PartialMenuItem key={id} onClick={() => onPublishVendor(id)}>
                  <Checkbox checked={vendorID === id} readOnly /> {name}
                </PartialMenuItem>
              ))}
            </PartialMenu>
          }
          dropdownProps={{ selfDismiss: true }}
        >
          {buttonLabel}
        </AnyDropdownButton>
      ) : (
        <UploadButton icon={buttonIcon} id={Identifier.UPLOAD} onClick={onPublish} isUploading={job?.status === JobStatus.ACTIVE}>
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
