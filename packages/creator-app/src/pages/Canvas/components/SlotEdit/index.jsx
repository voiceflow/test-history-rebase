import { Constants } from '@voiceflow/alexa-types';
import { PlanType } from '@voiceflow/internal';
import { Button, ClickableText, Flex, FlexApart, flexApartStyles, Input, Select, stopPropagation, SvgIcon, TippyTooltip, toast } from '@voiceflow/ui';
import _sample from 'lodash/sample';
import React from 'react';

import { ModalFooter } from '@/components/LegacyModal';
import RemoveDropdown from '@/components/RemoveDropdown';
import Section from '@/components/Section';
import { FeatureFlag } from '@/config/features';
import { CUSTOM_SLOT_TYPE, ModalType, SLOT_COLORS } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as RealtimeWorkspace from '@/ducks/realtimeV2/workspace';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slot';
import * as Version from '@/ducks/version';
import * as Workspace from '@/ducks/workspace';
import { styled } from '@/hocs';
import { useFeature, useModals, useSelector, useTeardown } from '@/hooks';
import { replace, without } from '@/utils/array';
import { formatIntentName } from '@/utils/intent';
import { validateSlotName } from '@/utils/slot';
import { removeTrailingUnderscores } from '@/utils/string';

import { ColorSelector, SlotTag } from './components';
import CustomLine from './components/CustomLine';
import EntitySection from './components/EntitySection';
import ValueSynonymsSection from './components/ValueSynonymsSection';
import { generateSlotInput, mergeSlotInputs } from './utils';

const UNSUPPORTED_CUSTOM_VALUE_SLOTS = [
  Constants.SlotType.DATE,
  Constants.SlotType.DURATION,
  Constants.SlotType.NUMBER,
  Constants.SlotType.ORDINAL,
  Constants.SlotType.PHONENUMBER,
  Constants.SlotType.SEARCHQUERY,
  Constants.SlotType.TIME,
  Constants.SlotType.FOUR_DIGIT_NUMBER,
];

const isUnsupportedCustomSlotValues = (slotType) => UNSUPPORTED_CUSTOM_VALUE_SLOTS.includes(slotType);

const FlexModalFooter = styled(ModalFooter)`
  ${flexApartStyles}
  flex-direction: row-reverse;
`;

function SlotEdit({ id, name = '', type, color = _sample(SLOT_COLORS), inputs = [], onSave, onRemove, isCreate, onDelete, isInteraction }) {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);

  const planV1 = useSelector(Workspace.planTypeSelector);
  const planRealtime = useSelector((state) => RealtimeWorkspace.workspacePlanTypeByIDSelector(state, { id: activeWorkspaceID }));
  const slots = useSelector(Slot.allSlotsSelector);
  const intents = useSelector(Intent.allIntentsSelector);
  const slotTypes = useSelector(Version.activeSlotTypesSelector) ?? [];
  const intentsUsingSlot = useSelector(Slot.intentsUsingSlotSelector);

  const plan = atomicActions.isEnabled ? planRealtime : planV1;

  const isDeleteable = !isCreate && !!onDelete;

  const { open: openImportBulkDeniedModal } = useModals(ModalType.IMPORT_BULK_DENIED);
  const { open: openSlotsBulkUploadModal } = useModals(ModalType.IMPORT_SLOTS);
  const [selectedColor, setSelectedColor] = React.useState(color);
  const [slotType, setSlotType] = React.useState(() => type || (slotTypes.length === 1 ? slotTypes[0].value : type));
  const [slotName, setSlotName] = React.useState(() => removeTrailingUnderscores(formatIntentName(name)));
  const [customLines, setCustomLines] = React.useState(() =>
    inputs?.length ? inputs : (slotType === CUSTOM_SLOT_TYPE && [generateSlotInput()]) || inputs
  );
  const slotTypesMap = React.useMemo(() => slotTypes.reduce((obj, option) => Object.assign(obj, { [option.value]: option }), {}), [slotTypes]);
  const nameRef = React.useRef(null);
  const onCustomLineChange = React.useCallback(
    (index, data) => setCustomLines(replace(customLines, index, { ...customLines[index], ...data })),
    [customLines]
  );

  const notEmptyValues = React.useMemo(() => customLines.some(({ value, synonyms }) => value.trim() || synonyms.trim()), [customLines]);

  const updateSlot = () => {
    const formattedSlotName = removeTrailingUnderscores(slotName);

    const error = validateSlotName({
      slots: slots.filter((slot) => slot.id !== id),
      intents,
      slotName: formattedSlotName,
      slotType,
      notEmptyValues,
    });

    if (error) {
      toast.error(error);
    } else {
      onSave?.({
        type: slotType,
        name: formattedSlotName,
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
            {slotName}
          </SlotTag>
        }
      >
        <FlexApart>
          <Input
            value={slotName}
            onBlur={isInteraction && onBlurInInteraction}
            onChange={(e) => setSlotName(formatIntentName(e.target.value))}
            placeholder="Enter Entity Name"
            ref={nameRef}
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
          <Button variant="primary" onClick={updateSlot}>
            {isCreate ? 'Create' : 'Update'} Entity
          </Button>

          {isDeleteable && <ClickableText onClick={deleteSlot}>Delete Entity</ClickableText>}
        </FlexModalFooter>
      )}
    </>
  );
}

export default SlotEdit;
