import { TextButton } from '@voiceflow/ui';
import React from 'react';

import { TEAM_LIMIT } from '@/config/planLimitV2/editorSeats';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useOnAddSeats, useSelector } from '@/hooks';

const TakenSeatsMessage = () => {
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);

  const onAddSeats = useOnAddSeats();

  return (
    <span>
      <strong>{usedEditorSeats}</strong> of {TEAM_LIMIT.increasableLimit} seats taken. <TextButton onClick={onAddSeats}>Need more?</TextButton>
    </span>
  );
};

export default TakenSeatsMessage;
