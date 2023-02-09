import { Text, TextButton } from '@voiceflow/ui';
import React from 'react';

import { TEAM_LIMIT } from '@/config/planLimitV2/editorSeats';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';
import { useOnAddSeats } from '@/hooks/workspace';

export interface TakenSeatsMessageProps {
  error?: boolean;
  small?: boolean;
  seats?: number;
}

const TakenSeatsMessage: React.FC<TakenSeatsMessageProps> = ({ error = false, seats, small }) => {
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);

  const onAddSeats = useOnAddSeats();

  return (
    <Text fontSize={small ? 13 : 15} color="#62778c" lineHeight={small ? '18px' : undefined}>
      <Text color={error ? '#BD425F' : '#132144'}>{seats ?? usedEditorSeats}</Text> of {TEAM_LIMIT.increasableLimit} Editor seats taken.{' '}
      <TextButton onClick={() => onAddSeats(seats ?? usedEditorSeats)}>Need more?</TextButton>
    </Text>
  );
};

export default TakenSeatsMessage;
