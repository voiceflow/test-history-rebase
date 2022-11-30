import { TextButton } from '@voiceflow/ui';
import React from 'react';

import { EditorLimitDetailsDashboardV2, STARTER_PRO_EDITOR_LIMIT } from '@/config/planLimits/numEditors';
import { ModalType } from '@/constants';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useModals, useSelector } from '@/hooks';

const WorkspaceTakenSeatsMessage = () => {
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const updgradeModal = useModals(ModalType.UPGRADE_MODAL);

  const handleAddSeats = () => updgradeModal.open({ planLimitDetails: EditorLimitDetailsDashboardV2 });

  return (
    <span>
      <strong>{usedEditorSeats}</strong> of {STARTER_PRO_EDITOR_LIMIT} seats taken. <TextButton onClick={handleAddSeats}>Need more?</TextButton>
    </span>
  );
};

export default WorkspaceTakenSeatsMessage;
