import { Button, Modal, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as Assistant from '@/components/Assistant';

interface MembersProps {
  onAdd: (member: Assistant.Member) => void;
  onNext: VoidFunction;
  onClose: VoidFunction;
  members: Assistant.Member[];
  onRemove: (memberID: number) => void;
  onChangeRole: (memberID: number, role: Assistant.Member['role']) => void;
  disabled?: boolean;
}

const Members: React.FC<MembersProps> = ({ onAdd, onNext, onClose, members, onRemove, onChangeRole, disabled }) => {
  return (
    <>
      <SectionV2.SimpleContentSection
        header={
          <SectionV2.Title bold secondary>
            Manage Access
          </SectionV2.Title>
        }
        headerProps={{ bottomUnit: 1.5, pb: 11 }}
        contentProps={{ bottomOffset: 2.5 }}
      >
        <Assistant.InviteMember onAdd={onAdd} members={members} />
      </SectionV2.SimpleContentSection>

      <SectionV2.Divider inset />

      <Assistant.MembersList members={members} onRemove={onRemove} onChangeRole={onChangeRole} />

      <Modal.Footer gap={12}>
        <Button disabled={disabled} variant={Button.Variant.TERTIARY} onClick={() => onClose()} squareRadius>
          Cancel
        </Button>

        <Button disabled={disabled} onClick={() => onNext()}>
          Create Assistant
        </Button>
      </Modal.Footer>
    </>
  );
};

export default Members;
