import * as Realtime from '@voiceflow/realtime-sdk';
import {
  Box,
  ClickableText,
  stopPropagation,
  StrengthGauge,
  StrengthLevel,
  SvgIcon,
  TippyTooltip,
  useDidUpdateEffect,
  useEnableDisable,
  useOnScreen,
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
import * as IntentV2 from '@/ducks/intentV2';
import * as SlotV2 from '@/ducks/slotV2';
import { useAddSlot, useModals, usePermission, useSelector, useSetup } from '@/hooks';
import UtteranceInput from '@/pages/Canvas/components/IntentModalsV2/components/components/UtteranceSection/components/UtteranceInput';
import { validateUtterance } from '@/utils/intent';

export const PREFILLED_UTTERANCE_PARAM = 'utterance';

interface UtteranceManagerProps {
  creating?: boolean;
  autofocus?: boolean;
  withBorderTop?: boolean;
  onUpdateUtterances: (data: Realtime.IntentInput[]) => void;
  inputs: Realtime.IntentInput[];
  intentID?: string;
}

const MAX_VISIBLE_UTTERANCES_HEIGHT = 550;
const MAX_VISIBLE_UTTERANCES = 10;

// Temporary until ML stuff is done
const determineStrength = (count: number) => {
  if (count === 0) {
    return StrengthLevel.NOT_SET;
  }
  if (count < 3) {
    return StrengthLevel.WEAK;
  }
  if (count < 5) {
    return StrengthLevel.MEDIUM;
  }
  if (count < 7) {
    return StrengthLevel.STRONG;
  }
  if (count >= 7) {
    return StrengthLevel.VERY_STRONG;
  }
  return StrengthLevel.NOT_SET;
};

export interface UtteranceRef {
  focus: () => void;
  clear: () => void;
  forceUpdate: VoidFunction;
  withBorderTop?: boolean;
  forceFocusToTheEnd: VoidFunction;
  getCurrentUtterance: () => Realtime.IntentInput | null;
}

const UtteranceManager: React.FC<UtteranceManagerProps> = ({ intentID, inputs, onUpdateUtterances, autofocus, withBorderTop }) => {
  const { search } = useLocation();

  const queryParams = queryString.parse(search);
  const prefilledNewUtterance = queryParams[PREFILLED_UTTERANCE_PARAM] as string | null;
  const history = useHistory();
  const stickyTopRef = React.useRef<HTMLDivElement>(null);
  const isNotAtTop = useOnScreen(stickyTopRef, true);

  const intents = useSelector(IntentV2.allIntentsSelector);
  const slots = useSelector(SlotV2.allSlotsSelector);

  const utteranceRef = React.useRef<UtteranceRef>(null);

  const [showAllUtterances, setShowAllUtterances] = React.useState(false);
  const [isEmpty, updateIsEmpty] = React.useState(true);

  const { open: openImportBulkDeniedModal } = useModals(ModalType.IMPORT_BULK_DENIED);
  const { open: openUtterancesBulkUploadModal } = useModals(ModalType.IMPORT_UTTERANCES);
  const [canBulkUpload] = usePermission(Permission.BULK_UPLOAD);
  const [isValidUtterance, setValidUtterance, setInvalidUtterance] = useEnableDisable(true);
  const intentUtterances = inputs || [];

  useDidUpdateEffect(() => {
    utteranceRef.current?.clear();
  }, [intentID]);

  React.useEffect(() => {
    if (autofocus) {
      utteranceRef.current?.forceFocusToTheEnd();
    }

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
        intentID,
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
        customContentStyling={{ marginBottom: intentUtterances.length ? 25 : 8, padding: 0 }}
        header={
          <>
            Utterances
            <Box marginLeft={16} display="inline-block" position="relative" bottom="3px">
              <StrengthGauge
                width={40}
                strength={determineStrength(intentUtterances.length)}
                strengthTooltips={{ [StrengthLevel.NOT_SET]: 'No utterances' }}
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
          borderTop: withBorderTop && isNotAtTop ? 'solid 1px #eaeff4' : undefined,
        }}
      >
        <Box>
          <ListManagerWrapper>
            <ListManager
              renderList={({ mapManaged, itemRenderer }) => (
                <Box pt={!isValidUtterance && !intentUtterances.length ? 8 : 21} px={32} style={{ ...utteranceListStyling }}>
                  {mapManaged(itemRenderer)}
                </Box>
              )}
              items={intentUtterances}
              addToStart
              divider={false}
              beforeAdd={() => utteranceRef.current?.forceUpdate()}
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
            <Box color="#62778c" pt={16} px={32}>
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
