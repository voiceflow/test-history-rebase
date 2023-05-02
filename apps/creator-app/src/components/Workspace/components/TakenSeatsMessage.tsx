import { Text, TextButton } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission } from '@/hooks/permission';
import { useSelector } from '@/hooks/redux';
import { useOnAddSeats } from '@/hooks/workspace';

export interface TakenSeatsMessageProps {
  error?: boolean;
  small?: boolean;
  seats?: number;
  label?: React.ReactNode;
}

const TakenSeatsMessage: React.FC<TakenSeatsMessageProps> = ({ error = false, seats, small, label = 'seats taken.' }) => {
  const [canAddSeats] = usePermission(Permission.BILLING_SEATS_ADD);

  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);

  const onAddSeats = useOnAddSeats();

  return (
    <Text fontSize={small ? 13 : 15} color="#62778c" lineHeight={small ? '18px' : undefined}>
      {canAddSeats ? (
        <>
          <Text color={error ? '#BD425F' : '#132144'}>{seats ?? usedEditorSeats}</Text> of {numberOfSeats} {label}{' '}
          <TextButton onClick={() => onAddSeats(seats ?? usedEditorSeats)}>Need more?</TextButton>
        </>
      ) : (
        <>
          <Text color="#132144">
            {seats ?? usedEditorSeats} {!label && 'Editor seats'}
          </Text>{' '}
          {!label && 'being used in this workspace.'}
          {label}
        </>
      )}
    </Text>
  );
};

export default TakenSeatsMessage;
