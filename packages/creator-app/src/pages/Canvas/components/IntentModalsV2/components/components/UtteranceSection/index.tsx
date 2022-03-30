import * as Realtime from '@voiceflow/realtime-sdk';
import {
  Box,
  ClickableText,
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
import UtteranceInput from '@/pages/Canvas/components/IntentModalsV2/components/components/UtteranceSection/components/UtteranceInput';
import { validateUtterance } from '@/utils/intent';

export const PREFILLED_UTTERANCE_PARAM = 'utterance';

interface UtteranceManagerProps {
  intent: Realtime.Intent;
  creating?: boolean;
  withBorderTop?: boolean;
}

const MAX_VISIBLE_UTTERANCES_HEIGHT = 545;
const MAX_VISIBLE_UTTERANCES = 10;

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

export interface UtteranceRefProps {
  forceFocusToTheEnd: VoidFunction;
  forceUpdate: VoidFunction;
  getCurrentUtterance: () => Realtime.IntentInput | null;
  withBorderTop?: boolean;
  focus: () => void;
}

const UtteranceManager: React.FC<UtteranceManagerProps> = ({ withBorderTop, intent }) => {
  const { search } = useLocation();
  const { isInStack } = useModals(ModalType.INTENT_CREATE);

  const queryParams = queryString.parse(search);
  const prefilledNewUtterance = queryParams[PREFILLED_UTTERANCE_PARAM] as string | null;
  const history = useHistory();
  const stickyTopRef = React.useRef<HTMLDivElement>(null);
  const isNotAtTop = useOnScreen(stickyTopRef, true);

  const intents = useSelector(IntentV2.allIntentsSelector);
  const slots = useSelector(SlotV2.allSlotsSelector);

  const patchIntent = useDispatch(Intent.patchIntent);
  const utteranceRef = React.useRef<UtteranceRefProps>(null);

  const [showAllUtterances, setShowAllUtterances] = React.useState(false);
  const [isEmpty, updateIsEmpty] = React.useState(true);

  const { open: openImportBulkDeniedModal } = useModals(ModalType.IMPORT_BULK_DENIED);
  const { open: openUtterancesBulkUploadModal } = useModals(ModalType.IMPORT_UTTERANCES);
  const [canBulkUpload] = usePermission(Permission.BULK_UPLOAD);
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
    if (isInStack) {
      utteranceRef.current?.focus();
    }

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

  const utteranceListStyling = showAllUtterances ? {} : { maxHeight: MAX_VISIBLE_UTTERANCES_HEIGHT, overflow: 'hidden' };

  return (
    <>
      <div ref={stickyTopRef} />
      <Section
        suffix={
          <TippyTooltip title="Bulk Import">
            <SvgIcon icon="upload" clickable onClick={stopPropagation(onBulkUploadClick)} />
          </TippyTooltip>
        }
        customContentStyling={{ marginBottom: intentUtterances.length ? 24 : 14 }}
        header={
          <>
            Utterances
            <Box marginLeft={16} display="inline-block" position="relative" bottom="3px">
              <StrengthGauge
                strengthTooltips={{ [StrengthLevel.NOT_SET]: 'No utterances' }}
                width={40}
                strength={determineStrength(intentUtterances.length)}
              />
            </Box>
          </>
        }
        variant={SectionVariant.QUATERNARY}
        customHeaderStyling={{
          paddingBottom: '16px',
          position: 'sticky',
          paddingTop: '20px',
          top: 0,
          background: 'white',
          zIndex: 2,
          borderTop: withBorderTop ? 'solid 1px #eaeff4' : undefined,
        }}
      >
        <Box>
          <ListManagerWrapper>
            <ListManager
              renderList={({ mapManaged, itemRenderer }) => (
                <Box overflow="auto" mr={-12} pt={!isValidUtterance && !intentUtterances.length ? 8 : 16} style={{ ...utteranceListStyling }}>
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
                <UtteranceInput
                  intentUtterances={intentUtterances}
                  setValidUtterance={setValidUtterance}
                  ref={utteranceRef}
                  slots={slots}
                  value={value}
                  updateIsEmpty={(val) => updateIsEmpty(val)}
                  isEmpty={isEmpty}
                  isNotAtTop={isNotAtTop}
                  addError={addError}
                  onAddSlot={onAddSlot}
                  onAdd={onAdd}
                  isValidUtterance={isValidUtterance}
                  onChange={onChange}
                />
              )}
              addValidation={addValidation}
              onUpdate={onUpdateUtterances}
              renderItem={(item, { onUpdate }) => (
                <Utterance space slots={slots} value={item?.text} onBlur={onUpdate} onEnterPress={onUpdate} onAddSlot={onAddSlot} />
              )}
            />
          </ListManagerWrapper>
          {intentUtterances.length > MAX_VISIBLE_UTTERANCES && (
            <Box color="#62778c" pt={16}>
              {!showAllUtterances ? (
                <ClickableText onClick={() => setShowAllUtterances(true)}>{`Show all utterances (${intentUtterances.length})`}</ClickableText>
              ) : (
                <ClickableText onClick={() => setShowAllUtterances(false)}>Hide some utterances</ClickableText>
              )}
            </Box>
          )}
        </Box>
      </Section>
    </>
  );
};

export default UtteranceManager;
