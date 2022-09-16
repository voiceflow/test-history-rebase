import * as Realtime from '@voiceflow/realtime-sdk';
import { pickRandomDefaultColor, StrictPopperModifiers } from '@voiceflow/ui';
import React from 'react';

import * as SlotDuck from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import * as Tracking from '@/ducks/tracking';
import { useDispatch, useLinkedState, useSelector } from '@/hooks';

import EntityForm from '.';

interface EditEntityFormProps {
  slotID: string;
  withNameSection?: boolean;
  withBottomDivider?: boolean;
  colorPopperModifiers?: StrictPopperModifiers;
  creationType: Tracking.NLUEntityCreationType;
}

const EditEntityForm: React.FC<EditEntityFormProps> = ({ colorPopperModifiers, withNameSection, slotID, withBottomDivider, creationType }) => {
  const slot = useSelector(SlotV2.slotByIDSelector, { id: slotID });
  const patchSlot = useDispatch(SlotDuck.patchSlot, slotID);
  const defaultColor = React.useMemo(() => pickRandomDefaultColor(), []);

  const [type] = useLinkedState(slot?.type ?? null);
  const [name, setName] = useLinkedState(slot?.name ?? '');
  const [color, setColor] = useLinkedState(slot?.color || defaultColor);

  if (!slot) return null;

  const saveType = (type: string) => {
    patchSlot({ type }, creationType);
  };

  const saveName = () => {
    patchSlot({ name }, creationType);
  };

  const saveValues = (values: Realtime.SlotInput[]) => {
    patchSlot({ inputs: values }, creationType);
  };

  const saveColor = (color: string) => {
    setColor(color);
    patchSlot({ color }, creationType);
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
      withBottomDivider={withBottomDivider}
    />
  );
};

export default EditEntityForm;
