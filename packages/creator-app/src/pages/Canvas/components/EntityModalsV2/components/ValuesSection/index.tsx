import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge, Box, ClickableText, Input, stopPropagation, SvgIcon, TippyTooltip, toast, useDidUpdateEffect, useOnScreen } from '@voiceflow/ui';
import React from 'react';

import ListManagerWrapper from '@/components/IntentForm/components/ListManagerWrapper';
import ListManager from '@/components/ListManager';
import Section, { SectionVariant } from '@/components/Section';
import { Permission } from '@/config/permissions';
import { BulkImportLimitDetails } from '@/config/planLimits/bulkImport';
import { CUSTOM_SLOT_TYPE, ModalType } from '@/constants';
import { useModals, usePermission } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { DividerBorder } from '@/pages/Canvas/components/IntentModalsV2/components/components';
import { generateSlotInput, mergeSlotInputs } from '@/pages/Canvas/components/SlotEdit/utils';

import InputItem from './components/InputItem';

const MAX_VISIBLE_VALUES = 10;

interface ValuesSectionProps {
  type: string | null;
  inputs: Realtime.SlotInput[];
  updateInputs: (inputs: Realtime.SlotInput[]) => void;
  withBottomDivider?: boolean;
}

const updateSingleLine = (id: string, inputs: Realtime.SlotInput[], values: Partial<Realtime.SlotInput>) =>
  inputs.map((line) => (line.id === id ? { ...line, ...values } : line));

const ValuesSection: React.FC<ValuesSectionProps> = ({ withBottomDivider, inputs, type, updateInputs }) => {
  const valueRef = React.useRef<HTMLInputElement | null>(null);
  const stickyTopRef = React.useRef<HTMLDivElement>(null);
  const isNotAtTop = useOnScreen(stickyTopRef, { initialState: true });
  const { open: openUpgradeModal } = useModals(ModalType.UPGRADE_MODAL);
  const { open: openSlotsBulkUploadModal } = useModals(ModalType.IMPORT_SLOTS);
  const [canBulkUpload] = usePermission(Permission.BULK_UPLOAD);

  const [newValueText, setNewValueText] = React.useState('');
  const [showAllValues, setShowAllValues] = React.useState(false);
  const [customLines, setCustomLines] = React.useState<Realtime.SlotInput[]>(() =>
    inputs?.length ? inputs : (type === CUSTOM_SLOT_TYPE && []) || inputs
  );

  useDidUpdateEffect(() => {
    setCustomLines(inputs);
  }, [inputs]);

  const onBulkUploadClick = React.useCallback(() => {
    if (canBulkUpload) {
      openSlotsBulkUploadModal({
        onUpload: (slots: string[][]) => {
          const newCustomLines = slots.map(([value, ...synonyms]) => generateSlotInput(value, synonyms.join(', ')));
          const mergedSlotInputs = mergeSlotInputs(newCustomLines, customLines);
          updateInputs(mergedSlotInputs);
        },
      });
    } else {
      openUpgradeModal({ planLimitDetails: BulkImportLimitDetails });
    }
  }, [customLines]);

  const isValidNewInput = (input: Realtime.SlotInput) => {
    if (!input) return false;

    const { value } = input;

    if (inputs.some((input) => input.value.trim() === value.trim())) {
      toast.error(`Value ${value} already being used`);
      return false;
    }

    return true;
  };

  const handleNewInput = (
    onAdd: (value: Realtime.SlotInput) => void,
    onChange: (value: Realtime.SlotInput) => void,
    value?: Realtime.SlotInput | null
  ) => {
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

  const onUpdateValueProps = (slotInput: Realtime.SlotInput, props: Partial<Realtime.SlotInput>) => {
    const newCustomLines = updateSingleLine(slotInput.id, customLines, { ...props });
    setCustomLines(newCustomLines);
    updateInputs(newCustomLines);
  };

  const updateFormValue = (value: Realtime.SlotInput, text: string) => {
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

  return (
    <>
      <div ref={stickyTopRef} />
      <Section
        infix={
          <TippyTooltip title="Bulk Import">
            <SvgIcon icon="upload" clickable onClick={stopPropagation(onBulkUploadClick)} />
          </TippyTooltip>
        }
        header="Values"
        variant={SectionVariant.QUATERNARY}
        forceDividers
        customContentStyling={{ padding: 0 }}
        customHeaderStyling={{
          paddingTop: '20px',
          paddingBottom: '16px',
          position: 'sticky',
          top: -1,
          background: 'white',
          zIndex: 2,
          borderTop: 'solid 1px #eaeff4',
        }}
      >
        <Box paddingBottom={0}>
          <FormControl>
            <ListManagerWrapper>
              <ListManager
                maxVisibleItems={showAllValues ? customLines.length : MAX_VISIBLE_VALUES}
                renderList={({ mapManaged, itemRenderer }) => (
                  <Box overflow="auto" mb={8} px={32}>
                    {mapManaged(itemRenderer)}
                  </Box>
                )}
                items={customLines}
                addToStart
                divider={false}
                initialValue={generateSlotInput()}
                renderForm={({ value, onChange, onAdd }) => (
                  <Box position="sticky" top={58} zIndex={1000} px={32} backgroundColor="white">
                    <Input
                      ref={valueRef}
                      value={newValueText}
                      onChangeText={(text) => {
                        setNewValueText(text);
                        if (value) {
                          onChange(updateFormValue(value, text));
                        }
                      }}
                      onEnterPress={() => handleNewInput(onAdd, onChange, value)}
                      placeholder="Value: synonym, synonym 2..."
                      rightAction={
                        newValueText ? (
                          <Badge slide onClick={() => handleNewInput(onAdd, onChange, value)}>
                            Enter
                          </Badge>
                        ) : (
                          <span></span>
                        )
                      }
                    />
                    {!!customLines.length && <hr style={!isNotAtTop ? { marginLeft: '-32px' } : undefined} />}
                  </Box>
                )}
                onUpdate={(lines) => {
                  setCustomLines(lines);
                  updateInputs(lines);
                }}
                renderItem={(slotInput) => <InputItem slotInput={slotInput} onUpdateItem={(data) => onUpdateValueProps(slotInput, data)} />}
              />
            </ListManagerWrapper>
          </FormControl>

          {customLines.length > MAX_VISIBLE_VALUES && (
            <Box color="#62778c" pb={24} mt={-8} px={32}>
              <ClickableText onClick={() => setShowAllValues(!showAllValues)}>
                {showAllValues ? `Hide some values` : `Show all values (${customLines.length})`}
              </ClickableText>
            </Box>
          )}
        </Box>
      </Section>
      {withBottomDivider && <DividerBorder />}
    </>
  );
};

export default ValuesSection;
