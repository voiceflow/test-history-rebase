import { UserRole } from '@voiceflow/internal';
import { Flex, toast } from '@voiceflow/ui';
import React from 'react';

import ButtonDropdownInput, { OrientationType } from '@/components/ButtonDropdownInput';
import InvalidEmailError from '@/components/InvalidEmailError';
import { FeatureFlag } from '@/config/features';
import { EDITOR_SEAT_ROLES, ModalType } from '@/constants';
import * as RealtimeWorkspace from '@/ducks/realtimeV2/workspace';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import { useEnableDisable, useFeature, useModals, useRealtimeSelector, useSelector, useWorkspaceUserRoleSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';
import { isValidEmail } from '@/utils/emails';

import Container from './components/Container';
import SendInviteButton from './components/SendInviteButton';

const ADMIN_OPTION = {
  value: UserRole.ADMIN,
  label: 'can admin',
};

const OPTIONS_ARRAY = [
  { value: UserRole.EDITOR, label: 'can edit' },
  { value: UserRole.VIEWER, label: 'can view' },
];

interface SendInviteProps {
  inline?: boolean;
  sendInvite: (email: string, role: UserRole) => void;
}

const SendInvite: React.FC<SendInviteProps> = ({ inline, sendInvite }) => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const userRole = useWorkspaceUserRoleSelector();
  const seatLimitsV1 = useSelector(Workspace.seatLimitsSelector);
  const seatLimitsRealtime = useRealtimeSelector((state) => RealtimeWorkspace.workspaceSeatLimitsByIDSelector(state, { id: activeWorkspaceID }));
  const numberOfSeatsV1 = useSelector(Workspace.workspaceNumberOfSeatsSelector);
  const numberOfSeatsRealtime = useRealtimeSelector((state) =>
    RealtimeWorkspace.workspaceNumberOfSeatsByIDSelector(state, { id: activeWorkspaceID })
  );
  const usedEditorSeatsV1 = useSelector(Workspace.usedEditorSeatsSelector);
  const usedEditorSeatsRealtime = useRealtimeSelector((state) =>
    RealtimeWorkspace.workspaceUsedEditorSeatsByIDSelector(state, { id: activeWorkspaceID })
  );
  const usedViewerSeatsV1 = useSelector(Workspace.usedViewerSeatsSelector);
  const usedViewerSeatsRealtime = useRealtimeSelector((state) =>
    RealtimeWorkspace.workspaceUsedViewerSeatsByIDSelector(state, { id: activeWorkspaceID })
  );

  const numberOfSeats = atomicActions.isEnabled ? numberOfSeatsRealtime : numberOfSeatsV1;
  const seatLimits = atomicActions.isEnabled ? seatLimitsRealtime : seatLimitsV1;
  const usedEditorSeats = atomicActions.isEnabled ? usedEditorSeatsRealtime : usedEditorSeatsV1;
  const usedViewerSeats = atomicActions.isEnabled ? usedViewerSeatsRealtime : usedViewerSeatsV1;

  const [email, setEmail] = React.useState('');
  const [permissionType, setPermissionType] = React.useState(OPTIONS_ARRAY[0]);
  const [isInvalid, setInvalid, setValid] = useEnableDisable(false);
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);

  const inviteOptions = React.useMemo(() => {
    const options = [...OPTIONS_ARRAY];
    if (userRole === UserRole.ADMIN) {
      options.push(ADMIN_OPTION);
    }
    return options;
  }, [userRole]);

  const onSendInviteClick = async () => {
    if (!isValidEmail(email)) {
      setInvalid();
    } else {
      setValid();
      const role = permissionType.value;

      const paidEditorSeats = numberOfSeats!;
      const numberOfUsedEditorSeats = usedEditorSeats;

      if (numberOfUsedEditorSeats >= paidEditorSeats && EDITOR_SEAT_ROLES.includes(UserRole.EDITOR)) {
        return openPaymentsModal();
      }

      const viewerLimit = seatLimits!.viewer;
      if (usedViewerSeats >= viewerLimit && permissionType.value === UserRole.VIEWER) {
        return toast.error('Viewer limit reached.');
      }

      sendInvite(email, role);
      setEmail('');
    }
  };

  const setPermission = (value: UserRole) => {
    const option = inviteOptions.filter((obj) => obj.value === value)[0];

    setPermissionType(option);
  };

  return (
    <Container inline={inline} error={isInvalid}>
      <Flex>
        <ButtonDropdownInput
          orientation={OrientationType.LEFT}
          textValue={email}
          dropdownValue={permissionType}
          onDropdownChange={setPermission}
          options={inviteOptions}
          placeholder="Enter email"
          onTextChange={setEmail}
          error={isInvalid}
          onFocus={setValid}
        />

        <SendInviteButton id={Identifier.COLLAB_SEND_INVITE_BUTTON} onClick={onSendInviteClick} disabled={isInvalid}>
          Send
        </SendInviteButton>
      </Flex>

      {isInvalid && <InvalidEmailError>Email is not valid.</InvalidEmailError>}
    </Container>
  );
};

export default SendInvite;
