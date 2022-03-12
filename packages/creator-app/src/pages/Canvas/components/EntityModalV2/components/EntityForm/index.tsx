import { Input, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as SlotDuck from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import { useDispatch, useSelector } from '@/hooks';

import TypeSection from '../TypeSection';
import ValuesSection from '../ValuesSection';

interface EntityFormProps {
  slotID: string;
}

const EntityForm: React.FC<EntityFormProps> = ({ slotID }) => {
  const slot = useSelector(SlotV2.slotByIDSelector, { id: slotID });
  const patchSlot = useDispatch(SlotDuck.patchSlot, slotID);
  const [type, setType] = React.useState(slot?.type || null);
  const [name, setName] = React.useState(slot?.name || '');

  useDidUpdateEffect(() => {
    if (slot) {
      setType(slot.type);
      setName(slot.name);
    }
  }, [slotID]);

  if (!slot) return null;

  const handleNameSave = () => {
    patchSlot({ name });
  };

  const handleTypeChange = (type: string) => {
    setType(type);
    patchSlot({ type });
  };

  return (
    <>
      <Section backgroundColor="#fdfdfd" header="Name" variant={SectionVariant.QUATERNARY} customContentStyling={{ paddingBottom: '0px' }}>
        <Input onBlur={handleNameSave} placeholder="Enter entity name" value={name} onChange={(e) => setName(e.target.value)} />
      </Section>
      <TypeSection type={type} onChangeType={handleTypeChange} />
      <ValuesSection slot={slot} onUpdate={patchSlot} />
    </>
  );
};

export default EntityForm;
