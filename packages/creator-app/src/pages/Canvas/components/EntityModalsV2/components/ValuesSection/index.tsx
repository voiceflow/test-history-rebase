import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge, Box, ClickableText, Input, stopPropagation, SvgIcon, TippyTooltip, useDidUpdateEffect, useOnScreen } from '@voiceflow/ui';
import React from 'react';

import ListManagerWrapper from '@/components/IntentForm/components/ListManagerWrapper';
import ListManager from '@/components/ListManager';
import Section, { SectionVariant } from '@/components/Section';
import { Permission } from '@/config/permissions';
import { CUSTOM_SLOT_TYPE, ModalType } from '@/constants';
import { useModals, usePermission } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { generateSlotInput, mergeSlotInputs } from '@/pages/Canvas/components/SlotEdit/utils';

import InputItem from './components/InputItem';

const MAX_VISIBLE_VALUES = 10;

const MAX_VISIBLE_VALUE_HEIGHT = 795;

interface ValuesSectionProps {
  updateInputs: (inputs: Realtime.SlotInput[]) => void;
  inputs: Realtime.SlotInput[];
  type: string | null;
}

const updateSingleLine = (id: string, inputs: Realtime.SlotInput[], values: Partial<Realtime.SlotInput>) => {
  return inputs.map((line) => {
    if (line.id === id) {
      return {
        ...line,
        ...values,
      };
    }
    return line;
  });
};

const ValuesSection: React.FC<ValuesSectionProps> = ({ inputs, type, updateInputs }) => {
  const valueRef = React.useRef<HTMLInputElement | null>(null);
  const stickyTopRef = React.useRef<HTMLDivElement>(null);
  const isNotAtTop = useOnScreen(stickyTopRef, true);
  const { open: openImportBulkDeniedModal } = useModals(ModalType.IMPORT_BULK_DENIED);
  const { open: openSlotsBulkUploadModal } = useModals(ModalType.IMPORT_SLOTS);
  const [canBulkUpload] = usePermission(Permission.BULK_UPLOAD);

  const [newValueText, setNewValueText] = React.useState('');
  const [showAllValues, setShowAllValues] = React.useState(false);
  const [customLines, setCustomLines] = React.useState<Realtime.SlotInput[]>(() =>
    inputs?.length ? inputs : (type === CUSTOM_SLOT_TYPE && [generateSlotInput()]) || inputs
  );

  useDidUpdateEffect(() => {
    setCustomLines(inputs);
  }, [inputs]);

  const onBulkUploadClick = React.useCallback(() => {
    if (canBulkUpload) {
      openSlotsBulkUploadModal({
        onUpload: (slots: string[]) => {
          const newCustomLines = slots.map(([value, ...synonyms]) => generateSlotInput(value, synonyms.join(', ')));
          const mergedSlotInputs = mergeSlotInputs(newCustomLines, customLines);
          updateInputs(mergedSlotInputs);
        },
      });
    } else {
      openImportBulkDeniedModal();
    }
  }, [customLines]);

  const valueListStyling = showAllValues ? {} : { maxHeight: MAX_VISIBLE_VALUE_HEIGHT, overflow: 'hidden' };

  const handleNewInput = (
    onAdd: (value: Realtime.SlotInput) => void,
    onChange: (value: Realtime.SlotInput) => void,
    value?: Realtime.SlotInput | null
  ) => {
    if (!newValueText.trim()) return;
    if (value) {
      onAdd(value);
    }
    onChange(generateSlotInput());
    setNewValueText('');
  };

  const onUpdateValueProps = (slotInput: Realtime.SlotInput, props: Partial<Realtime.SlotInput>) => {
    const newCustomLines = updateSingleLine(slotInput.id, customLines, { ...props });
    setCustomLines(newCustomLines);
    updateInputs(newCustomLines);
  };

  const updateFormValue = (value: Realtime.SlotInput, text: string) => {
    const hasColon = text.includes(':');
    const hasCommas = text.includes(',');

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
                renderList={({ mapManaged, itemRenderer }) => (
                  <Box overflow="auto" mr={-12} style={{ ...valueListStyling }}>
                    {mapManaged(itemRenderer)}
                  </Box>
                )}
                items={customLines}
                addToStart
                divider={false}
                initialValue={generateSlotInput()}
                renderForm={({ value, onChange, onAdd }) => (
                  <Box position="sticky" top={62} zIndex={1000} style={{ background: 'white' }}>
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
                renderItem={(slotInput) => (
                  <InputItem
                    slotInput={slotInput}
                    onUpdateSynonym={(synonyms: string) => onUpdateValueProps(slotInput, { synonyms })}
                    onUpdateValue={(value) => onUpdateValueProps(slotInput, { value })}
                  />
                )}
              />
            </ListManagerWrapper>
          </FormControl>

          {customLines.length > MAX_VISIBLE_VALUES && (
            <Box color="#62778c" paddingBottom={24}>
              <ClickableText onClick={() => setShowAllValues(!showAllValues)}>
                {showAllValues ? `Hide some utterances` : `Show all values (${customLines.length})`}
              </ClickableText>
            </Box>
          )}
        </Box>
      </Section>
    </>
  );
};

export default ValuesSection;
