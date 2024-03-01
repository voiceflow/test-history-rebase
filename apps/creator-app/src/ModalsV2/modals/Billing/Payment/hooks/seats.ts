import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { UNLIMITED_EDITORS_CONST } from '@/constants';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';

import * as atoms from '../Payment.atoms';

export const useSeats = () => {
  const [selectedEditorSeats, setSelectedEditorSeats] = useAtom(atoms.editorSeatsAtom);
  const editorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const viewerSeats = useSelector(WorkspaceV2.active.usedViewerSeatsSelector);
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const editorPlanSeatLimits = useSelector(WorkspaceV2.active.editorPlanSeatLimitsSelector);

  const usedEditorSeats = numberOfSeats === UNLIMITED_EDITORS_CONST ? editorSeats : numberOfSeats;
  const downgradedSeats = usedEditorSeats - editorSeats;

  const onChangeEditorSeats = (seats: number) => {
    setSelectedEditorSeats(seats);
  };

  useEffect(() => {
    setSelectedEditorSeats(editorSeats);
  }, []);

  return {
    selectedEditorSeats,
    downgradedSeats,
    editorSeats,
    usedEditorSeats,
    viewerSeats,
    editorPlanSeatLimits,
    onChangeEditorSeats,
  };
};
