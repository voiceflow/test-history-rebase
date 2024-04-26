import { Text, TextButton } from '@voiceflow/ui';
import React from 'react';

import { TEAM_PLUS_PLANS } from '@/constants';
import { PRICING_LINK } from '@/constants/link.constant';
import { Permission } from '@/constants/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission } from '@/hooks/permission';
import { useSelector } from '@/hooks/redux';
import { useOnAddSeats } from '@/hooks/workspace';
import { isPlanFactory } from '@/utils/plans';
import { openURLInANewTab } from '@/utils/window';

export interface TakenSeatsMessageProps {
  error?: boolean;
  small?: boolean;
  seats?: number;
  label?: React.ReactNode;
}

const TakenSeatsMessage: React.FC<TakenSeatsMessageProps> = ({
  error = false,
  seats,
  small,
  label = 'seats taken.',
}) => {
  const [canAddSeats] = usePermission(Permission.BILLING_SEATS_ADD);

  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const activePlan = useSelector(WorkspaceV2.active.planSelector);

  const onAddSeats = useOnAddSeats();

  const handleNeedMoreClick = () => {
    if (!isPlanFactory(TEAM_PLUS_PLANS)(activePlan)) {
      openURLInANewTab(PRICING_LINK);
      return;
    }

    onAddSeats(seats ?? usedEditorSeats);
  };

  return (
    <Text fontSize={small ? 13 : 15} color="#62778c" lineHeight={small ? '18px' : undefined}>
      {canAddSeats ? (
        <>
          {error ? (
            <Text color="#BD325F">Editor limit reached. </Text>
          ) : (
            <>
              <Text color="#132144">{seats ?? usedEditorSeats}</Text> of {numberOfSeats} {label}{' '}
            </>
          )}

          <TextButton onClick={handleNeedMoreClick}>Need more?</TextButton>
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
