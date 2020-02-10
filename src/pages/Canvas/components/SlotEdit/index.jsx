import cuid from 'cuid';
import _sample from 'lodash/sample';
import React from 'react';

import Button from '@/components/Button';
import Flex, { flexApartStyles } from '@/components/Flex';
import Input from '@/components/Input';
import { ModalFooter } from '@/components/LegacyModal';
import Section from '@/components/Section';
import Select from '@/components/Select';
import SvgIcon from '@/components/SvgIcon';
import ClickableText from '@/components/Text/ClickableText';
import { toast } from '@/components/Toast';
import { SlotTag } from '@/components/VariableTag';
import { CUSTOM_SLOT_TYPE, SLOT_COLORS } from '@/constants';
import * as Slot from '@/ducks/slot';
import { connect, styled } from '@/hocs';
import { activeSlotTypes } from '@/store/selectors';
import { replace, without } from '@/utils/array';
import { formatIntentName } from '@/utils/intent';

import { ColorSelector } from './components';
import CustomLine from './components/CustomLine';
import ValueSynonymsSection from './components/ValueSynonymsSection';

const FlexModalFooter = styled(ModalFooter)`
  ${flexApartStyles}
  flex-direction: row-reverse;
`;

const generateEmptyLineItem = () => ({
  id: cuid.slug(),
  value: '',
  synonyms: '',
});

function SlotEdit({ isCreate, name = '', color = _sample(SLOT_COLORS), type, inputs = [], slotTypes = [], onSave, onDelete, id, intentsUsingSlot }) {
  const isDeleteable = !isCreate && !!onDelete;
  const [selectedColor, setSelectedColor] = React.useState(color);
  const [slotType, setSlotType] = React.useState(type);
  const [slotName, setSlotName] = React.useState(name);
  const [customLines, setCustomLines] = React.useState(inputs);
  const slotTypesMap = React.useMemo(() => slotTypes.reduce((obj, option) => Object.assign(obj, { [option.value]: option }), {}), [slotTypes]);

  const onCustomLineChange = React.useCallback((index, data) => setCustomLines(replace(customLines, index, { ...customLines[index], ...data })), [
    customLines,
  ]);

  const notEmptyValues = React.useMemo(() => customLines.some(({ value, synonyms }) => value.trim() || synonyms.trim()), [customLines]);

  const updateSlot = () => {
    if (!slotName.trim()) {
      toast.error('Slot must have a name');
    } else if (!slotType) {
      toast.error('Slot must have a type');
    } else if (slotType === CUSTOM_SLOT_TYPE && !notEmptyValues) {
      toast.error('Custom slot needs at least one value');
    } else {
      onSave?.({
        type: slotType,
        name: slotName,
        color: selectedColor,
        inputs: customLines,
      });
    }
  };

  const deleteSlot = () => {
    const activeIntents = intentsUsingSlot(id);
    if (activeIntents.length > 0) {
      toast.error(`${slotName} is being used by intents: ${activeIntents.map(({ name }) => name).join(', ')}`);
    } else {
      onDelete(id);
    }
  };

  const addCustomLine = () => {
    setCustomLines([...customLines, generateEmptyLineItem()]);
  };

  const removeCustomLine = (index) => {
    if (slotType === CUSTOM_SLOT_TYPE && customLines.length <= 1) {
      return;
    }
    setCustomLines(without(customLines, index));
  };

  const updateSlotType = (type) => {
    setSlotType(type);
    if (type === CUSTOM_SLOT_TYPE && customLines.length === 0) {
      addCustomLine();
    }
    if (type !== CUSTOM_SLOT_TYPE && !notEmptyValues) {
      setCustomLines([]);
    }
  };

  React.useEffect(() => {
    setSlotName(name);
  }, [name]);

  return (
    <>
      <Section status={<SlotTag color={selectedColor}>{slotName}</SlotTag>} dividers={false} variant="tertiary" header="Slot Name">
        <Input value={slotName} onChange={(e) => setSlotName(formatIntentName(e.target.value))} placeholder="Enter Slot Name" />
      </Section>
      <Section dividers={false} variant="tertiary" header="Slot Type">
        <Select
          value={slotType}
          options={slotTypes}
          onSelect={updateSlotType}
          searchable
          placeholder="Select slot data type"
          getOptionValue={(option) => option.value}
          getOptionLabel={(optionValue) => slotTypesMap[optionValue]?.label}
        />
        <ValueSynonymsSection dividers={false}>
          {customLines.map((line, index) => (
            <CustomLine key={line.id} value={line} onChange={(data) => onCustomLineChange(index, data)} remove={() => removeCustomLine(index)} />
          ))}
          <ClickableText onClick={addCustomLine}>Add custom value</ClickableText>
        </ValueSynonymsSection>
      </Section>
      <Section dividers={false} variant="tertiary" header="Slot Color">
        <Flex>
          {SLOT_COLORS.map((color, index) => (
            <ColorSelector onClick={() => setSelectedColor(color)} key={index} color={color}>
              {selectedColor === color && <SvgIcon variant="white" size={10} icon="check" />}
            </ColorSelector>
          ))}
        </Flex>
      </Section>
      <FlexModalFooter>
        <Button variant="primary" onClick={updateSlot}>
          {isCreate ? 'Create' : 'Update'} Slot
        </Button>
        {isDeleteable && <ClickableText onClick={deleteSlot}>Delete Slot</ClickableText>}
      </FlexModalFooter>
    </>
  );
}
const mapStateToProps = {
  slotTypes: activeSlotTypes,
  intentsUsingSlot: Slot.intentsUsingSlotSelector,
};

export default connect(mapStateToProps)(SlotEdit);
