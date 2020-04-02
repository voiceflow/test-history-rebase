import React from 'react';
import { Input } from 'reactstrap';

import Button from '@/components/LegacyButton';
import Modal, { ModalBody, ModalHeader } from '@/components/LegacyModal';
import Image from '@/components/LegacyUpload/Image';
import { ModalType, PLANS } from '@/constants';
import { updateCurrentWorkspaceItem, updateWorkspaceName } from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';
import { swallowEvent } from '@/utils/dom';

import SettingField from './components/SettingField';

export function BoardSettingsModal({ user, workspace, updateWorkspaceName, updateCurrentWorkspaceItem }) {
  const [name, updateName] = React.useState(workspace.name);

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
            {withoutIcon ? (
              <img
                src="/images/icons/vf_logo.png"
                alt="Voiceflow"
                width={80}
                className="mt-2 mb-1 no-select"
                onDragStart={swallowEvent(null, true)}
              />
            ) : (
              <Image
                tiny
                path={`/team/${workspace.id}/picture`}
                image={workspace.image}
                update={(url) => updateCurrentWorkspaceItem({ image: url })}
                replace
                className="icon-image icon-image-sm icon-image-square mb-3"
              />
            )}
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

          {workspace.plan !== PLANS.enterprise && (
            <SettingField hr label="Billing" description="View invoices, update your payment options">
              <Button onClick={openBillingModal} isBtn isLinkLarge>
                Invoices
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

const mapStateToProps = {};

const mapDispatchToProps = {
  updateWorkspaceName,
  updateCurrentWorkspaceItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardSettingsModal);
