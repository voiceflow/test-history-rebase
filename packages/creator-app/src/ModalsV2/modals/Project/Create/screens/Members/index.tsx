import { UserRole } from '@voiceflow/internal';
import { Button, Modal, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import Assistant from '@/components/Assistant';

interface MembersProps {
  onAdd: (memberID: number) => void;
  onNext: VoidFunction;
  onClose: VoidFunction;
  onRemove: (memberID: number) => void;
  memberIDs: number[];
  onChangeRoles: (memberID: number, roles: UserRole[]) => void;
  memberRolesMap: Partial<Record<number, UserRole[]>>;
}

const Members: React.OldFC<MembersProps> = ({ onAdd, onNext, onClose, onRemove, memberIDs, onChangeRoles, memberRolesMap }) => {
  return (
    <>
      <SectionV2.SimpleContentSection
        header={
          <SectionV2.Title bold secondary>
            Manage Access
          </SectionV2.Title>
        }
        headerProps={{ bottomUnit: 1.5 }}
        contentProps={{ bottomOffset: 2.5 }}
      >
        <Assistant.InviteMember onAdd={onAdd} memberIDs={memberIDs} />
      </SectionV2.SimpleContentSection>

      <SectionV2.Divider inset />

      <Assistant.MembersList memberIDs={memberIDs} memberRolesMap={memberRolesMap} onRemove={onRemove} onChangeRoles={onChangeRoles} />

      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.TERTIARY} onClick={() => onClose()} squareRadius>
          Cancel
        </Button>

        <Button onClick={() => onNext()}>Create Assistant</Button>
      </Modal.Footer>
    </>
  );
};

export default Members;
