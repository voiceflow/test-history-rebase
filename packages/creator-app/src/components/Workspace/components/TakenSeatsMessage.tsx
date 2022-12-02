import { TextButton } from '@voiceflow/ui';
import React from 'react';

import { LimitType } from '@/config/planLimitV2';
import { TEAM_LIMIT } from '@/config/planLimitV2/editorSeats';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePlanLimited, useSelector } from '@/hooks';
import * as Modals from '@/ModalsV2';

const TakenSeatsMessage = () => {
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);

  const paymentModal = Modals.useModal(Modals.Payment);
  const upgradeModal = Modals.useModal(Modals.Upgrade);

  const limit = usePlanLimited({ type: LimitType.EDITOR_SEATS, limit: numberOfSeats ?? 1, value: usedEditorSeats });

  const onAddSeats = () => {
    if (!limit?.increasableLimit || limit.increasableLimit > usedEditorSeats) {
      paymentModal.open({});
    } else {
      upgradeModal.open(limit.upgradeModal);
    }
  };

  return (
    <span>
      <strong>{usedEditorSeats}</strong> of {TEAM_LIMIT.increasableLimit} seats taken. <TextButton onClick={onAddSeats}>Need more?</TextButton>
    </span>
  );
};

export default TakenSeatsMessage;
