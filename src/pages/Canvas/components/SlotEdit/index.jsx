import _sample from 'lodash/sample';
import React from 'react';

import Button from '@/components/Button';
import Flex, { FlexApart, flexApartStyles } from '@/components/Flex';
import Input from '@/components/Input';
import { ModalFooter } from '@/components/LegacyModal';
import RemoveDropdown from '@/components/RemoveDropdown';
import Section from '@/components/Section';
import Select from '@/components/Select';
import SvgIcon from '@/components/SvgIcon';
import { ClickableText } from '@/components/Text';
import TippyTooltip from '@/components/TippyTooltip';
import { toast } from '@/components/Toast';
import { CUSTOM_SLOT_TYPE, ModalType, PlanType, SLOT_COLORS } from '@/constants';
import * as Slot from '@/ducks/slot';
import * as Workspace from '@/ducks/workspace';
import { connect, styled } from '@/hocs';
import { useDidUpdateEffect, useModals } from '@/hooks';
import { activeSlotTypesSelector } from '@/store/selectors';
import { replace, without } from '@/utils/array';
import { stopPropagation } from '@/utils/dom';
import { formatIntentName } from '@/utils/intent';
import { removeTrailingUnderscores } from '@/utils/string';

import { ColorSelector, SlotTag } from './components';
import CustomLine from './components/CustomLine';
import ValueSynonymsSection from './components/ValueSynonymsSection';
import { generateSlotInput, mergeSlotInputs } from './utils';

const UNSUPPORTED_CUSTOM_VALUE_SLOTS = ['Date', 'Duration', 'Number', 'Ordinal', 'PhoneNumber', 'SearchQuery', 'Time', 'AMAZON.FOUR_DIGIT_NUMBER'];

const isUnsupportedCustomSlotValues = (slotType) => UNSUPPORTED_CUSTOM_VALUE_SLOTS.includes(slotType);

const FlexModalFooter = styled(ModalFooter)`
  ${flexApartStyles}
  flex-direction: row-reverse;
`;

function SlotEdit({
  id,
  name = '',
  plan,
  type,
  color = _sample(SLOT_COLORS),
  inputs = [],
  onSave,
  onRemove,
  isCreate,
  onDelete,
  slotTypes = [],
  isInteraction,
  intentsUsingSlot,
}) {
  const isDeleteable = !isCreate && !!onDelete;

  const { open: openImportBulkDeniedModal } = useModals(ModalType.IMPORT_BULK_DENIED);
  const { open: openSlotsBulkUploadModal } = useModals(ModalType.IMPORT_SLOTS);
  const [selectedColor, setSelectedColor] = React.useState(color);
  const [slotType, setSlotType] = React.useState(type);
  const [slotName, setSlotName] = React.useState(() => removeTrailingUnderscores(formatIntentName(name)));
  const [customLines, setCustomLines] = React.useState(inputs);
  const slotTypesMap = React.useMemo(() => slotTypes.reduce((obj, option) => Object.assign(obj, { [option.value]: option }), {}), [slotTypes]);
  const nameRef = React.useRef(null);
  const onCustomLineChange = React.useCallback((index, data) => setCustomLines(replace(customLines, index, { ...customLines[index], ...data })), [
    customLines,
  ]);

  const notEmptyValues = React.useMemo(() => customLines.some(({ value, synonyms }) => value.trim() || synonyms.trim()), [customLines]);

  const updateSlot = () => {
    if (!slotName.trim()) {
      toast.error('Slot must have a name');
    } else if (slotName.length > 32) {
      toast.error('Slot name cannot exceed 32 characters');
    } else if (!slotType) {
      toast.error('Slot must have a type');
    } else if (slotType === CUSTOM_SLOT_TYPE && !notEmptyValues) {
      toast.error('Custom slot needs at least one value');
    } else {
      onSave?.({
        type: slotType,
        name: removeTrailingUnderscores(slotName),
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
    setCustomLines([...customLines, generateSlotInput()]);
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

  const onBulkUploadClick = () => {
    if ([PlanType.OLD_STARTER, PlanType.STARTER].includes(plan)) {
      openImportBulkDeniedModal();
    } else {
      openSlotsBulkUploadModal({
        onUpload: (slots) => {
          const newCustomLines = slots.map(([slot, ...synonyms]) => generateSlotInput(slot, synonyms.join(', ')));

          setCustomLines((prevLines) => mergeSlotInputs(prevLines, newCustomLines));
        },
      });
    }
  };

  const onBlurInInteraction = () => {
    setSlotName(removeTrailingUnderscores(slotName));
    updateSlot();
  };

  React.useEffect(() => {
    if (isUnsupportedCustomSlotValues(slotType)) {
      setCustomLines([]);
    }
  }, [slotType]);

  React.useEffect(() => {
    setSlotName(formatIntentName(name));
  }, [name]);

  React.useEffect(() => {
    if (!name) {
      nameRef.current?.focus();
    }
  }, []);

  useDidUpdateEffect(() => {
    if (isInteraction) {
      updateSlot();
    }
  }, [slotType, selectedColor, customLines.length]);

  return (
    <>
      <Section
        status={
          <SlotTag color={selectedColor} isInteraction={isInteraction}>
            {slotName}
          </SlotTag>
        }
        dividers={false}
        variant="tertiary"
        header="Slot Name"
      >
        <FlexApart>
          <Input
            value={slotName}
            onBlur={isInteraction && onBlurInInteraction}
            onChange={(e) => setSlotName(formatIntentName(e.target.value))}
            placeholder="Enter Slot Name"
            ref={nameRef}
          />

          {isInteraction && <RemoveDropdown onRemove={() => onRemove(id)} />}
        </FlexApart>
      </Section>

      <Section
        dividers={false}
        variant="tertiary"
        header="Slot Type"
        infix={
          <TippyTooltip title="Bulk Import">
            <SvgIcon icon="upload" clickable onClick={stopPropagation(onBulkUploadClick)} />
          </TippyTooltip>
        }
      >
        <Select
          value={slotType}
          options={slotTypes}
          onSelect={updateSlotType}
          searchable
          placeholder="Select slot data type"
          getOptionValue={(option) => option.value}
          getOptionLabel={(optionValue) => slotTypesMap[optionValue]?.label}
        />

        {!isUnsupportedCustomSlotValues(slotType) && (
          <ValueSynonymsSection dividers={false}>
            {customLines.map((line, index) => (
              <CustomLine
                key={line.id}
                value={line}
                remove={() => removeCustomLine(index)}
                onBlur={isInteraction && updateSlot}
                onChange={(data) => onCustomLineChange(index, data)}
                removeDisabled={slotType === CUSTOM_SLOT_TYPE && customLines.length <= 1}
              />
            ))}
            <ClickableText onClick={addCustomLine}>Add custom value</ClickableText>
          </ValueSynonymsSection>
        )}
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

      {!isInteraction && (
        <FlexModalFooter>
          <Button variant="primary" onClick={updateSlot}>
            {isCreate ? 'Create' : 'Update'} Slot
          </Button>

          {isDeleteable && <ClickableText onClick={deleteSlot}>Delete Slot</ClickableText>}
        </FlexModalFooter>
      )}
    </>
  );
}
const mapStateToProps = {
  plan: Workspace.planTypeSelector,
  slotTypes: activeSlotTypesSelector,
  intentsUsingSlot: Slot.intentsUsingSlotSelector,
};

export default connect(mapStateToProps)(SlotEdit);
