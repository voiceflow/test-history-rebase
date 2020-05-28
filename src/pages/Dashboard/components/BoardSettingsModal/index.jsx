import React from 'react';
import { Input } from 'reactstrap';

import Button from '@/components/LegacyButton';
import Modal, { ModalBody, ModalHeader } from '@/components/LegacyModal';
import { UploadJustIcon } from '@/components/Upload/ImageUpload/IconUpload';
import { ModalType, PlanType } from '@/constants';
import { updateWorkspaceImage, updateWorkspaceName } from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useDidUpdateEffect, useModals } from '@/hooks';

import SettingField from './components/SettingField';

export function BoardSettingsModal({ user, workspace, updateWorkspaceName, updateWorkspaceImage }) {
  const [name, updateName] = React.useState(workspace.name);
  const [image, updateImage] = React.useState(workspace.image);
  const { open: openBillingModal } = useModals(ModalType.BILLING);
  const { toggle, isOpened } = useModals(ModalType.BOARD_SETTINGS);
  const { open: openDeleteModal } = useModals(ModalType.BOARD_DELETE);

  const saveName = React.useCallback(() => {
    if (name && name !== workspace.name) {
      updateWorkspaceName(name);
    } else {
      updateName(workspace.name);
    }
  }, [name, updateWorkspaceName, updateName]);

  useDidUpdateEffect(() => {
    updateWorkspaceImage(image);
  }, [image]);

  React.useEffect(() => {
    updateName(workspace.name);
  }, [workspace.id, workspace.name]);

  // do not show for the no-admin users
  if (workspace.creatorID !== user.creator_id) {
    return null;
  }

  const withoutIcon = workspace.status === 0;

  return (
    <Modal isOpen={isOpened} toggle={toggle} className="upgrade-modal">
      <ModalHeader toggle={toggle} header="Workspace Settings" />

      <ModalBody className="px-45 pt-0 overflow-hidden">
        <div className="mb-3">
          <SettingField label="Workspace Icon" description={withoutIcon ? 'Upgrade this workspace under billing to add a custom image' : null}>
            <UploadJustIcon image={workspace.image} update={updateImage} size="medium" />
          </SettingField>

          {withoutIcon && (
            <>
              <br />
              <br />
            </>
          )}

          <SettingField hr label="Name">
            <Input name="name" value={name} onBlur={saveName} onChange={(e) => updateName(e.target.value)} placeholder="Board Name" />
          </SettingField>

          {(workspace.plan !== PlanType.ENTERPRISE || workspace.plan !== PlanType.OLD_ENTERPRISE) && (
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
}

const mapDispatchToProps = {
  updateWorkspaceName,
  updateWorkspaceImage,
};

export default connect(null, mapDispatchToProps)(BoardSettingsModal);
