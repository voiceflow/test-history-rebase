import React from 'react';
import { Input } from 'reactstrap';

import Button from '@/components/LegacyButton';
import Modal, { ModalBody, ModalHeader } from '@/components/LegacyModal';
import { UploadJustIcon } from '@/components/Upload/ImageUpload/IconUpload';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as Account from '@/ducks/account';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useDidUpdateEffect, useModals, usePermission } from '@/hooks';
import * as Models from '@/models';
import { ConnectedProps } from '@/types';

import SettingField from './components/SettingField';

const UploadJustIconComponent: React.FC<any> = UploadJustIcon;

export type BoardSettingsModalProps = {
  user: Account.AccountState;
  workspace: Models.Workspace;
};

export const BoardSettingsModal: React.FC<BoardSettingsModalProps & ConnectedBoardSettingsModalProps> = ({
  user,
  workspace,
  updateWorkspaceName,
  updateWorkspaceImage,
}) => {
  const [name, updateName] = React.useState(workspace.name);
  const [image, updateImage] = React.useState<string | null>(workspace.image);
  const { open: openBillingModal } = useModals(ModalType.BILLING);
  const { toggle, isOpened } = useModals(ModalType.BOARD_SETTINGS);
  const { open: openDeleteModal } = useModals(ModalType.BOARD_DELETE);
  const [canManageBilling] = usePermission(Permission.MANAGE_BILLING);

  const saveName = React.useCallback(() => {
    if (name && name !== workspace.name) {
      updateWorkspaceName(name);
    } else {
      updateName(workspace.name);
    }
  }, [name, updateWorkspaceName, updateName]);

  useDidUpdateEffect(() => {
    updateWorkspaceImage(image!);
  }, [image]);

  React.useEffect(() => {
    updateName(workspace.name);
  }, [workspace.id, workspace.name]);

  // do not show for the no-admin users
  if (workspace.creatorID !== user.creator_id) {
    return null;
  }

  return (
    <Modal isOpen={isOpened} toggle={toggle} className="upgrade-modal">
      <ModalHeader toggle={toggle} header="Workspace Settings" />

      <ModalBody className="px-45 pt-0 overflow-hidden">
        <div className="mb-3">
          <SettingField label="Workspace Icon" description={null}>
            <UploadJustIconComponent image={workspace.image} update={updateImage} size="medium" />
          </SettingField>

          <SettingField hr label="Name">
            <Input name="name" value={name} onBlur={saveName} onChange={(e) => updateName(e.target.value)} placeholder="Board Name" />
          </SettingField>

          {canManageBilling && (
            <SettingField hr label="Billing" description="View invoices, update your payment options">
              <Button onClick={openBillingModal} isBtn isLinkLarge>
                Manage Payments
              </Button>
            </SettingField>
          )}

          <SettingField label="Privacy" description="This action is irreversible. All workspace and project data will be removed">
            <Button isBtn onClick={openDeleteModal} isLinkLarge>
              Delete Workspace
            </Button>
          </SettingField>
        </div>
      </ModalBody>
    </Modal>
  );
};

const mapDispatchToProps = {
  updateWorkspaceName: Workspace.updateWorkspaceName,
  updateWorkspaceImage: Workspace.updateWorkspaceImage,
};

type ConnectedBoardSettingsModalProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(BoardSettingsModal) as React.FC<BoardSettingsModalProps>;
