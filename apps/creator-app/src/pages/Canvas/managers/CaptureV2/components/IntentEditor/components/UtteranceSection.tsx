import { SLOT_REGEXP } from '@voiceflow/common';
import { Entity } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge, Box, ErrorMessage, SectionV2, stopPropagation, SvgIcon, Text, ThemeColor, toast, useRAF } from '@voiceflow/ui';
import React from 'react';

import Utterance, { UtteranceRef } from '@/components/Utterance';
import { useMapManager } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

interface UtteranceSectionProps {
  slot: Realtime.Slot | Entity;
  onChange: (utterances: Platform.Base.Models.Intent.Input[]) => void;
  utterances: Platform.Base.Models.Intent.Input[];
  usedEntities: Array<Realtime.Slot | Entity>;
  preventAccent?: boolean;
}

const UtteranceSection: React.FC<UtteranceSectionProps> = ({ slot, utterances, onChange, usedEntities, preventAccent }) => {
  const utteranceRef = React.useRef<UtteranceRef>(null);
  const [addError, setAddError] = React.useState('');
  const [isAddEmpty, setIsAddEmpty] = React.useState(true);

  const [badgeAddScheduler] = useRAF();

  const validate = ({ text }: Platform.Base.Models.Intent.Input, { index, isUpdate }: { index: number; isUpdate: boolean }) => {
    let error = '';
    const trimmedText = text.trim();

    if (utterances.some((utterance, indx) => utterance.text.trim() === trimmedText && (!isUpdate || indx !== index))) {
      error = 'The utterance is already defined.';
    }

    if (!trimmedText.match(SLOT_REGEXP)?.length) {
      error = `This capture utterance contains no entities. Use ‘{‘ to add the {${slot.name}} entity to the utterance`;
    }

    if (error) {
      (isUpdate ? toast.error : setAddError)(error);
    }

    return !error;
  };

  const onAdd = () => {
    utteranceRef.current?.blur();

    badgeAddScheduler(() => {
      utteranceRef.current?.clear();
      utteranceRef.current?.forceFocusToTheEnd();
    });
  };

  const mapManager = useMapManager(utterances, onChange, { onAdd, validate });

  return (
    <EditorV2.PersistCollapse namespace={['capture_utterances', slot.id]}>
      {({ collapsed, onToggle }) => (
        <SectionV2.CollapseSection
          header={
            <SectionV2.Header>
              <SectionV2.Title bold={!collapsed}>Utterances</SectionV2.Title>

              <SectionV2.CollapseArrowIcon collapsed={collapsed} />
            </SectionV2.Header>
          }
          onToggle={onToggle}
          collapsed={collapsed}
          preventAccent={preventAccent}
          containerToggle
        >
          <SectionV2.Content bottomOffset={2.5}>
            <Utterance
              ref={utteranceRef}
              space
              error={!!addError}
              slots={usedEntities}
              onEmpty={setIsAddEmpty}
              creatable={false}
              iconProps={{ variant: SvgIcon.Variant.BLUE }}
              rightAction={
                !isAddEmpty && (
                  <Badge slide onClick={stopPropagation(() => utteranceRef.current && mapManager.onAdd(utteranceRef.current.getCurrentUtterance()))}>
                    Enter
                  </Badge>
                )
              }
              placeholder="Add utterances, { to add entities"
              onEnterPress={mapManager.onAdd}
              onEditorStateChange={(state) => state.getSelection().getHasFocus() && setAddError('')}
            />

            {!!addError &&
              (utterances.length ? (
                <ErrorMessage mb={0}>{addError}</ErrorMessage>
              ) : (
                <ErrorMessage mb={0}>
                  Add utterances using the <Text color={ThemeColor.PRIMARY}>{`{${slot.name}}`}</Text> entity to improve your agents capture
                  accuracy.
                </ErrorMessage>
              ))}
          </SectionV2.Content>

          {!!mapManager.size && (
            <>
              <SectionV2.Divider inset offset={[0, 16]} />

              <SectionV2.Content>
                {mapManager.map((item, { key, isLast, onUpdate, onRemove }) => (
                  <Box key={key} pb={isLast ? 8 : 16}>
                    <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={onRemove} />}>
                      <Utterance
                        space
                        slots={usedEntities}
                        value={item.text}
                        onBlur={onUpdate}
                        autoFocus={false}
                        creatable={false}
                        onEnterPress={onUpdate}
                      />
                    </SectionV2.ListItem>
                  </Box>
                ))}
              </SectionV2.Content>
            </>
          )}
        </SectionV2.CollapseSection>
      )}
    </EditorV2.PersistCollapse>
  );
};

export default UtteranceSection;
