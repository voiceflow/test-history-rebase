import * as Realtime from '@voiceflow/realtime-sdk';
import {
  Badge,
  Box,
  ClickableText,
  ErrorMessage,
  stopPropagation,
  StrengthGauge,
  StrengthLevel,
  SvgIcon,
  TippyTooltip,
  useEnableDisable,
  useOnScreen,
  useSetup,
} from '@voiceflow/ui';
import queryString from 'query-string';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import ListManagerWrapper from '@/components/IntentForm/components/ListManagerWrapper';
import ListManager from '@/components/ListManager';
import Section, { SectionVariant } from '@/components/Section';
import Utterance from '@/components/Utterance';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as SlotV2 from '@/ducks/slotV2';
import { useAddSlot, useDispatch, useModals, usePermission, useSelector } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { validateUtterance } from '@/utils/intent';

export const PREFILLED_UTTERANCE_PARAM = 'utterance';

interface UtteranceManagerProps {
  intent: Realtime.Intent;
  creating?: boolean;
}

const MAX_VISIBLE_UTTERANCES = 10;

const UTTERANCE_EL_HEIGHT = 54;

// Temporary until ML stuff is done
const determineStrength = (count: number) => {
  if (count === 0) {
    return StrengthLevel.NOT_SET;
  }
  if (count < 4) {
    return StrengthLevel.WEAK;
  }
  if (count < 6) {
    return StrengthLevel.MEDIUM;
  }
  if (count < 11) {
    return StrengthLevel.STRONG;
  }
  if (count < 16) {
    return StrengthLevel.VERY_STRONG;
  }
  return StrengthLevel.NOT_SET;
};

const UtteranceManager: React.FC<UtteranceManagerProps> = ({ intent }) => {
  const { search } = useLocation();
  const queryParams = queryString.parse(search);
  const prefilledNewUtterance = queryParams[PREFILLED_UTTERANCE_PARAM] as string | null;
  const history = useHistory();
  const intents = useSelector(IntentV2.allIntentsSelector);
  const [showAllUtterances, setShowAllUtterances] = React.useState(false);
  const stickyTopRef = React.useRef<HTMLDivElement>(null);
  const isNotAtTop = useOnScreen(stickyTopRef, true);

  const slots = useSelector(SlotV2.allSlotsSelector);

  const patchIntent = useDispatch(Intent.patchIntent);
  const utteranceRef = React.useRef<{
    forceFocusToTheEnd: VoidFunction;
    forceUpdate: VoidFunction;
    getCurrentUtterance: () => Realtime.IntentInput | null;
  }>(null);
  const [canBulkUpload] = usePermission(Permission.BULK_UPLOAD);
  const [isEmpty, updateIsEmpty] = React.useState(true);
  const { open: openImportBulkDeniedModal } = useModals(ModalType.IMPORT_BULK_DENIED);
  const { open: openUtterancesBulkUploadModal } = useModals(ModalType.IMPORT_UTTERANCES);
  const [isValidUtterance, setValidUtterance, setInvalidUtterance] = useEnableDisable(true);
  const intentUtterances = intent?.inputs || [];

  const onUpdateUtterances = React.useCallback((inputs) => {
    patchIntent(intent.id, { inputs });
  }, []);

  React.useEffect(() => {
    if (prefilledNewUtterance) {
      utteranceRef.current?.forceFocusToTheEnd?.();
      updateIsEmpty(false);
    }
  }, [prefilledNewUtterance, utteranceRef]);

  useSetup(() => {
    // Remove the prefilled utterance query param, so on another intent select, the prefill won't persist.
    if (prefilledNewUtterance) {
      const queryParams = new URLSearchParams(search);
      queryParams.delete(PREFILLED_UTTERANCE_PARAM);
      history.replace({
        search: queryParams.toString(),
      });
    }
  });

  const { onAddSlot } = useAddSlot();

  const addValidation = React.useCallback(
    ({ text }) => {
      const error = validateUtterance(text, null, intents);

      if (error) {
        setInvalidUtterance();
      } else {
        setValidUtterance();
      }
      return { valid: !error, error };
    },
    [intents, setInvalidUtterance, setValidUtterance]
  );

  const onBulkUploadClick = () => {
    if (canBulkUpload) {
      openUtterancesBulkUploadModal({
        intentID: intent.id,
        onUpload: (utterances: Realtime.IntentInput[]) => {
          onUpdateUtterances([...intentUtterances, ...utterances]);
        },
      });
    } else {
      openImportBulkDeniedModal();
    }
  };

  const utteranceListStyling = showAllUtterances ? {} : { maxHeight: UTTERANCE_EL_HEIGHT * MAX_VISIBLE_UTTERANCES, overflow: 'hidden' };

  return (
    <>
      <div ref={stickyTopRef} />
      <Section
        suffix={
          <TippyTooltip title="Bulk Import">
            <SvgIcon icon="upload" clickable onClick={stopPropagation(onBulkUploadClick)} />
          </TippyTooltip>
        }
        header={
          <>
            Utterances
            <Box marginLeft={16} display="inline-block" position="relative" bottom="3px">
              <StrengthGauge width={40} strength={determineStrength(intentUtterances.length)} />
            </Box>
          </>
        }
        variant={SectionVariant.QUATERNARY}
        customHeaderStyling={{ paddingBottom: '16px', position: 'sticky', top: -1, background: 'white', zIndex: 2, borderTop: 'solid 1px #eaeff4' }}
      >
        <Box paddingBottom={2}>
          <FormControl>
            <ListManagerWrapper>
              <ListManager
                renderList={({ mapManaged, itemRenderer }) => (
                  <Box overflow="auto" mr={-12} pt={12} style={{ ...utteranceListStyling }}>
                    {mapManaged(itemRenderer)}
                  </Box>
                )}
                items={intentUtterances}
                addToStart
                divider={false}
                beforeAdd={() => {
                  utteranceRef.current?.forceUpdate();
                }}
                renderForm={({ value, onAdd, onChange, addError }) => (
                  <Box mb={intentUtterances.length ? -14 : 0} position="sticky" top={62} zIndex={1000} style={{ background: 'white' }}>
                    <Utterance
                      ref={utteranceRef}
                      space
                      slots={slots}
                      value={value?.text || ''}
                      onBlur={onChange}
                      onEmpty={updateIsEmpty}
                      onAddSlot={onAddSlot}
                      iconProps={{ variant: 'blue' }}
                      rightAction={
                        !isEmpty && (
                          <Badge
                            slide
                            onClick={() => {
                              const utterance = utteranceRef.current?.getCurrentUtterance();
                              !!utterance && onAdd(utterance);
                            }}
                          >
                            Enter
                          </Badge>
                        )
                      }
                      placeholder="Enter sample phrases"
                      onEnterPress={onAdd}
                      error={!isValidUtterance}
                    />
                    {!isValidUtterance && <ErrorMessage>{addError}</ErrorMessage>}
                    {!!intentUtterances.length && <hr style={!isNotAtTop ? { marginLeft: '-32px' } : undefined} />}
                  </Box>
                )}
                addValidation={addValidation}
                onUpdate={onUpdateUtterances}
                renderItem={(item, { onUpdate }) => (
                  <Utterance space slots={slots} value={item?.text} onBlur={onUpdate} onEnterPress={onUpdate} onAddSlot={onAddSlot} />
                )}
              />
            </ListManagerWrapper>
          </FormControl>
          {!showAllUtterances && intentUtterances.length > MAX_VISIBLE_UTTERANCES && (
            <Box color="#62778c" paddingBottom={24}>
              <ClickableText onClick={() => setShowAllUtterances(true)}>{`Show all utterances (${intentUtterances.length})`}</ClickableText>
            </Box>
          )}
        </Box>
      </Section>
    </>
  );
};

export default UtteranceManager;
