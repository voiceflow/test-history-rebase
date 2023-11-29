import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge, Box, ErrorMessage, Input, SectionV2, stopPropagation, SvgIcon, System, TippyTooltip, toast, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import EntityValueInput from '@/components/EntityValueInput';
import EntityValue from '@/components/GPT/components/EntityValue';
import Entity from '@/components/GPT/components/GenerateButton/components/Entity';
import { useGPTGenFeatures } from '@/components/GPT/hooks/feature';
import { useGenEntityValues } from '@/components/GPT/hooks/genEntityValues';
import ListManager from '@/components/ListManager';
import { CUSTOM_SLOT_TYPE } from '@/constants';
import { Permission } from '@/constants/permissions';
import { useBulkImportSlotsModal, useUpgradeModal } from '@/hooks/modal.hook';
import { usePermissionAction } from '@/hooks/permission';
import { generateSlotInput, isDefaultSlotName, mergeSlotInputs } from '@/utils/slot';

const MAX_VISIBLE_VALUES = 10;

interface ValuesSectionProps {
  type: string | null;
  name: string;
  inputs: Realtime.SlotInput[];
  onChange: (inputs: Realtime.SlotInput[]) => void;
  withBottomDivider?: boolean;
  error?: boolean;
}

const ValuesSection: React.FC<ValuesSectionProps> = ({ type, name, inputs, onChange, error }) => {
  const valueRef = React.useRef<HTMLInputElement | null>(null);

  const upgradeModal = useUpgradeModal();
  const bulkImportSlotsModal = useBulkImportSlotsModal();

  const [newValueText, setNewValueText] = React.useState('');
  const [showAllValues, setShowAllValues] = React.useState(false);

  const [customLines, setCustomLines] = React.useState<Realtime.SlotInput[]>(() =>
    inputs?.length ? inputs : (type === CUSTOM_SLOT_TYPE && []) || inputs
  );

  const onUpdate = (lines: Realtime.SlotInput[]) => {
    setCustomLines(lines);
    onChange(lines);
  };

  const onBulkUploadClick = usePermissionAction(Permission.BULK_UPLOAD, {
    onAction: async () => {
      try {
        const { slots } = await bulkImportSlotsModal.open();

        const newCustomLines = slots.map(([value, ...synonyms]) => generateSlotInput(value, synonyms.join(', ')));

        onChange(mergeSlotInputs(newCustomLines, customLines));
      } catch {
        // modal closed
      }
    },

    onPlanForbid: ({ planConfig }) => upgradeModal.openVoid(planConfig.upgradeModal()),
  });

  const isValidNewInput = (input: Realtime.SlotInput) => {
    if (!input) return false;

    const { value } = input;

    if (inputs.some((input) => input.value.trim() === value.trim())) {
      toast.error(`Value ${value} already being used`);
      return false;
    }

    return true;
  };

  const onAddNew = (onAdd: (value: Realtime.SlotInput) => void, onChange: (value: Realtime.SlotInput) => void, value?: Realtime.SlotInput | null) => {
    valueRef.current?.blur();

    if (!newValueText.trim()) return;

    if (value && isValidNewInput(value)) {
      onAdd(value);
      onChange(generateSlotInput());
      setNewValueText('');
    }

    // TODO: remove this and the blur above after the editors remove the utteranceManager
    // this fixes an input enter bug we had, evgeny and josh has context
    requestAnimationFrame(() => valueRef.current?.focus());
  };

  const onChangeForm = (value: Realtime.SlotInput, text: string) => {
    const hasCommas = text.includes(',');
    const hasColon = text.includes(':');

    if (hasColon) {
      const [valueName, synonymsText] = text.split(':');
      return { ...value, value: valueName, synonyms: synonymsText.trim() };
    }
    if (hasCommas) {
      const [valueName, ...synonymsText] = text.split(',');
      return { ...value, value: valueName, synonyms: synonymsText.join(', ') };
    }

    return { ...value, value: text };
  };

  const gptEntityValueGen = useGPTGenFeatures();

  const gptGenEntities = useGenEntityValues({
    inputs,
    onAccept: (recommended) => onChange([...inputs, ...recommended]),
    entityName: name,
    entityType: type,
  });

  useDidUpdateEffect(() => {
    setCustomLines(inputs);
  }, [inputs]);

  const renderMoreValuesToggle = ({ size }: { size: number }) => (
    <System.Link.Button onClick={() => setShowAllValues(!showAllValues)}>
      {showAllValues ? `Hide some values` : `Show all values (${size})`}
    </System.Link.Button>
  );

  return (
    <SectionV2.Sticky>
      {({ sticked }) => (
        <SectionV2 width="100%">
          <ListManager
            items={customLines}
            divider={false}
            onUpdate={onUpdate}
            addToStart
            initialValue={generateSlotInput()}
            maxVisibleItems={showAllValues ? customLines.length : MAX_VISIBLE_VALUES}
            renderItem={(slotInput, { onUpdate }) => (
              <EntityValueInput
                entity={slotInput}
                readOnly={!!gptGenEntities.items.length}
                onChange={(data) => onUpdate({ id: slotInput.id, ...data })}
              />
            )}
            renderList={({ mapManager, itemRenderer }) => (
              <SectionV2.Content px={32} topOffset={mapManager.isEmpty ? 0 : 2} bottomOffset={3} overflowY="scroll">
                {mapManager.map(itemRenderer)}

                {gptEntityValueGen.isEnabled ? (
                  <Box pt={16}>
                    {gptGenEntities.items.map((item, index) => (
                      <Box mb={16} key={item.id}>
                        <EntityValue
                          input={item}
                          index={mapManager.size + index + 1}
                          onFocus={() => gptGenEntities.onFocusItem(index)}
                          isActive={index === gptGenEntities.activeIndex}
                          onReject={() => gptGenEntities.onRejectItem(index)}
                          onChange={(data) => gptGenEntities.onChangeItem(index, { ...item, ...data })}
                          activeIndex={gptGenEntities.activeIndex}
                        />
                      </Box>
                    ))}

                    {mapManager.size > MAX_VISIBLE_VALUES && <Box mb={16}>{renderMoreValuesToggle({ size: mapManager.size })}</Box>}

                    <Entity
                      disabled={!!gptGenEntities.items.length || gptGenEntities.fetching}
                      isLoading={gptGenEntities.fetching}
                      onGenerate={({ quantity }) => gptGenEntities.onGenerate({ quantity })}
                      hasExtraContext={type !== CUSTOM_SLOT_TYPE || !isDefaultSlotName(name)}
                      contextEntities={mapManager.items}
                    />
                  </Box>
                ) : (
                  mapManager.size > MAX_VISIBLE_VALUES && <Box pt={16}>{renderMoreValuesToggle({ size: mapManager.size })}</Box>
                )}
              </SectionV2.Content>
            )}
            renderForm={({ value, onAdd, onChange, mapManager }) => (
              <SectionV2.Header
                sticky
                column
                sticked={sticked}
                topUnit={2.5}
                bottomUnit={mapManager.isEmpty && !gptGenEntities.items.length ? 0 : 2}
                insetBorder={!mapManager.isEmpty || !!gptGenEntities.items.length}
              >
                <Box.FlexApart pb={16} width="100%">
                  <SectionV2.Title bold secondary>
                    Values
                  </SectionV2.Title>

                  <TippyTooltip content="Bulk Import">
                    <SvgIcon icon="upload" variant={SvgIcon.Variant.STANDARD} onClick={stopPropagation(onBulkUploadClick)} clickable reducedOpacity />
                  </TippyTooltip>
                </Box.FlexApart>

                <Box.FlexAlignStart flexDirection="column" fullWidth>
                  <Input
                    ref={valueRef}
                    error={error && inputs.length === 0}
                    value={newValueText}
                    placeholder="Value: synonym, synonym 2..."
                    onChangeText={Utils.functional.chain<[string]>(setNewValueText, (text) => value && onChange(onChangeForm(value, text)))}
                    onEnterPress={(e) => {
                      e.preventDefault();
                      onAddNew(onAdd, onChange, value);
                    }}
                    rightAction={
                      newValueText ? (
                        <Badge slide onClick={() => onAddNew(onAdd, onChange, value)}>
                          Enter
                        </Badge>
                      ) : (
                        <span />
                      )
                    }
                  />
                  {error && inputs.length === 0 && <ErrorMessage mb={0}>Custom entity needs at least one value.</ErrorMessage>}
                </Box.FlexAlignStart>
              </SectionV2.Header>
            )}
          />
        </SectionV2>
      )}
    </SectionV2.Sticky>
  );
};

export default ValuesSection;
