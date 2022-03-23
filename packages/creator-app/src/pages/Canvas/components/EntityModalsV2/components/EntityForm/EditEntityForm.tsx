import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as SlotDuck from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import { useDispatch, useLinkedState, useSelector } from '@/hooks';

import EntityForm from '.';

interface EditEntityFormProps {
  slotID: string;
  withNameSection?: boolean;
}

const EditEntityForm: React.FC<EditEntityFormProps> = ({ withNameSection, slotID }) => {
  const slot = useSelector(SlotV2.slotByIDSelector, { id: slotID });
  const patchSlot = useDispatch(SlotDuck.patchSlot, slotID);

  const [type] = useLinkedState(slot?.type ?? null);
  const [name, setName] = useLinkedState(slot?.name ?? '');

  if (!slot) return null;

  const saveType = (type: string) => {
    patchSlot({ type });
  };

  const saveName = () => {
    patchSlot({ name });
  };

  const saveValues = (values: Realtime.SlotInput[]) => {
    patchSlot({ inputs: values });
  };

  return (
    <EntityForm
      values={slot.inputs}
      updateType={saveType}
      saveValues={saveValues}
      type={type}
      name={name}
      updateName={setName}
      saveName={saveName}
      withNameSection={withNameSection}
    />
  );
};

export default EditEntityForm;
