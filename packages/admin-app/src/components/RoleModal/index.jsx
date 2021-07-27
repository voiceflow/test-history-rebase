import { UserRole } from '@voiceflow/internal';
import { Box, Button, FlexEnd, Select } from '@voiceflow/ui';
import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import * as Admin from '@/ducks/adminV2';
import { connect } from '@/hocs';

const RoleModal = ({ isOpen, workspaceID, creator, activeRole, toggleModal, updateWorkspaceMemberRole }) => {
  const [role, setRole] = React.useState(activeRole);
  const [updating, setUpdating] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setRole(activeRole);
    }
  }, [isOpen]);

  const onUpdate = async () => {
    setUpdating(true);

    await updateWorkspaceMemberRole(workspaceID, creator.creator_id, role);

    toggleModal();

    setUpdating(false);
  };

  return (
    <div>
      <Modal centered isOpen={isOpen} toggle={toggleModal}>
        <ModalHeader>Change Role</ModalHeader>

        <ModalBody>
          <Select value={role} options={Object.values(UserRole)} onSelect={setRole} />
        </ModalBody>

        <ModalFooter>
          <FlexEnd>
            <Box mr={16}>
              <Button variant="secondary" onClick={toggleModal}>
                Cancel
              </Button>
            </Box>

            <Button disabled={updating} onClick={onUpdate}>
              Update
            </Button>
          </FlexEnd>
        </ModalFooter>
      </Modal>
    </div>
  );
};

const mapStateToProps = {
  creator: Admin.creatorSelector,
};

const mapDispatchToProps = {
  updateWorkspaceMemberRole: Admin.updateWorkspaceMemberRole,
};

export default connect(mapStateToProps, mapDispatchToProps)(RoleModal);
