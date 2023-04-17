import * as Realtime from '@voiceflow/realtime-sdk';
import { COLOR_PICKER_CONSTANTS, pickRandomDefaultColor, StrictPopperModifiers } from '@voiceflow/ui';
import React from 'react';

import * as SlotDuck from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import * as Tracking from '@/ducks/tracking';
import { useDispatch, useLinkedState, useSelector } from '@/hooks';

import EntityForm from '.';

interface EditEntityFormProps {
  slotID: string;
  creationType: Tracking.NLUEntityCreationType;
  withNameSection?: boolean;
  withBottomDivider?: boolean;
  colorPopperModifiers?: StrictPopperModifiers;
}

const EditEntityForm: React.FC<EditEntityFormProps> = ({ colorPopperModifiers, withNameSection, slotID, withBottomDivider, creationType }) => {
  const slot = useSelector(SlotV2.slotByIDSelector, { id: slotID });

  const patchSlot = useDispatch(SlotDuck.patchSlot, slotID);

  const defaultColor = React.useMemo(() => pickRandomDefaultColor(COLOR_PICKER_CONSTANTS.ALL_COLORS_WITH_DARK_BASE), []);

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
      type={type}
      name={name}
      color={color}
      values={slot.inputs}
      saveName={saveName}
      saveColor={saveColor}
      updateType={saveType}
      saveValues={saveValues}
      updateName={setName}
      withNameSection={withNameSection}
      withBottomDivider={withBottomDivider}
      colorPopperModifiers={colorPopperModifiers}
    />
  );
};

export default EditEntityForm;
