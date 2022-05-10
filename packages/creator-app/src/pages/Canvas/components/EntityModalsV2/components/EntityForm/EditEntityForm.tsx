import * as Realtime from '@voiceflow/realtime-sdk';
import { pickRandomDefaultColor, StrictPopperModifiers } from '@voiceflow/ui';
import React from 'react';

import * as SlotDuck from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import { useDispatch, useLinkedState, useSelector } from '@/hooks';

import EntityForm from '.';

interface EditEntityFormProps {
  slotID: string;
  withNameSection?: boolean;
  colorPopperModifiers?: StrictPopperModifiers;
}

const EditEntityForm: React.FC<EditEntityFormProps> = ({ colorPopperModifiers, withNameSection, slotID }) => {
  const slot = useSelector(SlotV2.slotByIDSelector, { id: slotID });
  const patchSlot = useDispatch(SlotDuck.patchSlot, slotID);
  const defaultColor = React.useMemo(() => pickRandomDefaultColor(), []);

  const [type] = useLinkedState(slot?.type ?? null);
  const [name, setName] = useLinkedState(slot?.name ?? '');
  const [color, setColor] = useLinkedState(slot?.color || defaultColor);

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

  const saveColor = (color: string) => {
    setColor(color);
    patchSlot({ color });
  };

  return (
    <EntityForm
      colorPopperModifiers={colorPopperModifiers}
      values={slot.inputs}
      updateType={saveType}
      saveValues={saveValues}
      type={type}
      name={name}
      color={color}
      saveColor={saveColor}
      updateName={setName}
      saveName={saveName}
      withNameSection={withNameSection}
      withBottomDivider
    />
  );
};

export default EditEntityForm;
