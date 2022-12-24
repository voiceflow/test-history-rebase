import { AlexaConstants } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import { Button, ClickableText, Flex, FlexApart, flexApartStyles, Input, Select, stopPropagation, SvgIcon, TippyTooltip, toast } from '@voiceflow/ui';
import _sample from 'lodash/sample';
import React from 'react';

import { ModalFooter } from '@/components/Modal';
import RemoveDropdown from '@/components/RemoveDropdown';
import Section from '@/components/Section';
import { Permission } from '@/config/permissions';
import { BulkImportLimitDetails } from '@/config/planLimits/bulkImport';
import { CUSTOM_SLOT_TYPE, ModalType, SLOT_COLORS } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/productV2';
import * as SlotV2 from '@/ducks/slotV2';
import * as VersionV2 from '@/ducks/versionV2';
import { styled } from '@/hocs/styled';
import { useModals, usePermission, useSelector, useTeardown, useTrackingEvents } from '@/hooks';
import { applySlotNameFormatting, slotNameFormatter, validateSlotName } from '@/utils/slot';

import { ColorSelector, SlotTag } from './components';
import CustomLine from './components/CustomLine';
import EntitySection from './components/EntitySection';
import ValueSynonymsSection from './components/ValueSynonymsSection';
import { generateSlotInput, mergeSlotInputs } from './utils';

const UNSUPPORTED_CUSTOM_VALUE_SLOTS = new Set([
  AlexaConstants.SlotType.DATE,
  AlexaConstants.SlotType.DURATION,
  AlexaConstants.SlotType.NUMBER,
  AlexaConstants.SlotType.ORDINAL,
  AlexaConstants.SlotType.PHONENUMBER,
  AlexaConstants.SlotType.SEARCHQUERY,
  AlexaConstants.SlotType.TIME,
  AlexaConstants.SlotType.FOUR_DIGIT_NUMBER,
]);

const isUnsupportedCustomSlotValues = (slotType) => UNSUPPORTED_CUSTOM_VALUE_SLOTS.has(slotType);

const FlexModalFooter = styled(ModalFooter)`
  ${flexApartStyles}
  flex-direction: row-reverse;
`;

function SlotEdit({ id, name = '', type, color = _sample(SLOT_COLORS), inputs = [], onSave, onRemove, isCreate, onDelete, isInteraction }) {
  const [canBulkUpload] = usePermission(Permission.BULK_UPLOAD);
  const slots = useSelector(SlotV2.allSlotsSelector);
  const intents = useSelector(IntentV2.allIntentsSelector);
  const slotTypes = useSelector(VersionV2.active.slotTypesSelector) ?? [];
  const getIntentsUsingSlot = useSelector(IntentV2.getIntentsUsingSlotSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);

  const isDeleteable = !isCreate && !!onDelete;

  const { open: openUpgradeModal } = useModals(ModalType.UPGRADE_MODAL);
  const { open: openSlotsBulkUploadModal } = useModals(ModalType.IMPORT_SLOTS);
  const [isSaving, setIsSaving] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState(color);
  const [slotType, setSlotType] = React.useState(() => type || (slotTypes.length === 1 ? slotTypes[0].value : type));
  const [slotName, setSlotName] = React.useState(() => Utils.string.removeTrailingUnderscores(applySlotNameFormatting(platform)(name)));
  const [customLines, setCustomLines] = React.useState(() =>
    inputs?.length ? inputs : (slotType === CUSTOM_SLOT_TYPE && [generateSlotInput()]) || inputs
  );

  const slotTypesMap = React.useMemo(() => slotTypes.reduce((obj, option) => Object.assign(obj, { [option.value]: option }), {}), [slotTypes]);
  const nameRef = React.useRef(null);
  const onCustomLineChange = React.useCallback(
    (index, data) => setCustomLines(Utils.array.replace(customLines, index, { ...customLines[index], ...data })),
    [customLines]
  );
  const [trackingEvents] = useTrackingEvents();

  const notEmptyValues = React.useMemo(() => customLines.some(({ value, synonyms }) => value.trim() || synonyms.trim()), [customLines]);

  const updateSlot = async () => {
    const formattedSlotName = slotNameFormatter(platform)(slotName);

    const error = validateSlotName({
      slots: slots.filter((slot) => slot.id !== id),
      intents,
      slotName: formattedSlotName,
      slotType,
      notEmptyValues,
    });

    if (error) {
      toast.error(error);
      return;
    }
    setIsSaving(true);
    try {
      await onSave?.({
        type: slotType,
        name: formattedSlotName,
        color: selectedColor,
        inputs: customLines,
      });
    } finally {
      trackingEvents.trackEntityEdit();
      setIsSaving(false);
    }
  };

  const deleteSlot = () => {
    const activeIntents = getIntentsUsingSlot({ id });
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
    setCustomLines(Utils.array.without(customLines, index));
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
    if (canBulkUpload) {
      openSlotsBulkUploadModal({
        onUpload: (slots) => {
          const newCustomLines = slots.map(([slot, ...synonyms]) => generateSlotInput(slot, synonyms.join(', ')));

          setCustomLines((prevLines) => mergeSlotInputs(prevLines, newCustomLines));
        },
      });
    } else {
      openUpgradeModal({ planLimitDetails: BulkImportLimitDetails });
    }
  };

  const onBlurInInteraction = () => {
    setSlotName(Utils.string.removeTrailingUnderscores(slotName));
    updateSlot();
  };

  React.useEffect(() => {
    if (isUnsupportedCustomSlotValues(slotType)) {
      setCustomLines([]);
    }
  }, [slotType]);

  React.useEffect(() => {
    setSlotName(applySlotNameFormatting(platform)(name));
  }, [name]);

  React.useEffect(() => {
    if (!name) {
      nameRef.current?.focus();
    }
  }, []);

  useTeardown(() => {
    if (isInteraction) {
      updateSlot();
    }
  }, [updateSlot]);

  return (
    <>
      <EntitySection
        dividers={false}
        variant="tertiary"
        header="Entity"
        status={
          <SlotTag color={selectedColor} isInteraction={isInteraction}>
            {`{${slotName}}`}
          </SlotTag>
        }
      >
        <FlexApart>
          <Input
            ref={nameRef}
            value={slotName}
            onBlur={isInteraction && onBlurInInteraction}
            placeholder="Enter Entity Name"
            onChangeText={(value) => setSlotName(applySlotNameFormatting(platform)(value))}
          />

          {isInteraction && <RemoveDropdown onRemove={() => onRemove(id)} />}
        </FlexApart>
      </EntitySection>

      <Section
        dividers={false}
        variant="tertiary"
        header="Entity Type"
        infix={
          <TippyTooltip title="Bulk Import">
            <SvgIcon icon="upload" clickable onClick={stopPropagation(onBulkUploadClick)} />
          </TippyTooltip>
        }
      >
        <Select
          value={slotType}
          options={slotTypes}
          disabled={slotType && slotTypes.length === 1}
          onSelect={updateSlotType}
          searchable
          placeholder="Select entity data type"
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

      <Section dividers={false} variant="tertiary" header="Entity Color">
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
          <Button variant="primary" onClick={updateSlot} disabled={isSaving}>
            {isCreate ? 'Create' : 'Update'} Entity
          </Button>

          {isDeleteable && <ClickableText onClick={deleteSlot}>Delete Entity</ClickableText>}
        </FlexModalFooter>
      )}
    </>
  );
}

export default SlotEdit;
