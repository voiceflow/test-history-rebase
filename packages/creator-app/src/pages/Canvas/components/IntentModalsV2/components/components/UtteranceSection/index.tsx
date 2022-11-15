import * as Platform from '@voiceflow/platform-config';
import {
  Badge,
  Box,
  ClickableText,
  stopPropagation,
  StrengthGauge,
  SvgIcon,
  TippyTooltip,
  toast,
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
import Utterance, { UtteranceRef } from '@/components/Utterance';
import { Permission } from '@/config/permissions';
import { BulkImportLimitDetails } from '@/config/planLimits/bulkImport';
import { ModalType, PREFILLED_UTTERANCE_PARAM } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import * as Tracking from '@/ducks/tracking';
import { useAddSlot, useModals, usePermission, useSelector, useSetup, useTrackingEvents } from '@/hooks';
import UtteranceInput from '@/pages/Canvas/components/IntentModalsV2/components/components/UtteranceSection/components/UtteranceInput';
import { EditorTabs } from '@/pages/NLUManager/constants';
import { NLUManagerContext } from '@/pages/NLUManager/context';
import { formatUtterance, getIntentStrengthLevel, validateUtterance } from '@/utils/intent';

interface UtteranceManagerProps {
  creating?: boolean;
  autofocus?: boolean;
  withBorderTop?: boolean;
  onUpdateUtterances: (data: Platform.Base.Models.Intent.Input[]) => void;
  inputs: Platform.Base.Models.Intent.Input[];
  intentID: string | null;
  isBuiltIn?: boolean;
  prefilledUtterance?: string;
  withRecommendations?: boolean;
  utteranceCreationType: Tracking.CanvasCreationType;
}

const MAX_VISIBLE_UTTERANCES = 10;

const UtteranceManager: React.FC<UtteranceManagerProps> = ({
  prefilledUtterance,
  isBuiltIn,
  withRecommendations,
  intentID,
  inputs,
  onUpdateUtterances,
  autofocus,
  withBorderTop,
  utteranceCreationType,
}) => {
  const { search } = useLocation();
  const nluManager = React.useContext(NLUManagerContext);

  const queryParams = queryString.parse(search);
  const prefilledNewUtterance = prefilledUtterance || (queryParams[PREFILLED_UTTERANCE_PARAM] as string | null);
  const history = useHistory();
  const stickyTopRef = React.useRef<HTMLDivElement>(null);
  const isNotAtTop = useOnScreen(stickyTopRef, { initialState: true });

  const intents = useSelector(IntentV2.allIntentsSelector);
  const slots = useSelector(SlotV2.allSlotsSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);

  const utteranceRef = React.useRef<UtteranceRef>(null);

  const [showAllUtterances, setShowAllUtterances] = React.useState(false);
  const [isEmpty, updateIsEmpty] = React.useState(true);

  const { open: openUpgradeModal } = useModals(ModalType.UPGRADE_MODAL);
  const { open: openUtterancesBulkUploadModal } = useModals(ModalType.IMPORT_UTTERANCES);
  const [canBulkUpload] = usePermission(Permission.BULK_UPLOAD);
  const [isValidUtterance, setValidUtterance, setInvalidUtterance] = useEnableDisable(true);
  const intentUtterances = inputs || [];
  const [trackingEvents] = useTrackingEvents();
  const isRecommendationOpened = nluManager.isEditorTabActive(EditorTabs.UTTERANCE_RECOMMENDATIONS);

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
      const error = validateUtterance(text, null, intents, platform);

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
        onUpload: (utterances: Platform.Base.Models.Intent.Input[]) => {
          onUpdateUtterances([...intentUtterances, ...utterances]);
        },
      });
    } else {
      openUpgradeModal({ planLimitDetails: BulkImportLimitDetails });
    }
  };

  const onUpdateUtterancesHandler = (intentUtterances: Platform.Base.Models.Intent.Input[]) => {
    const cleanedUtterances = intentUtterances.map((utterance) => {
      const text = formatUtterance(platform, utterance.text);

      if (text !== utterance.text) {
        toast.error('Utterance is not valid');
        return { ...utterance, text };
      }

      return utterance;
    });

    onUpdateUtterances(cleanedUtterances);
  };

  const toggleRecommendationTab = () => {
    if (isRecommendationOpened) {
      nluManager.closeEditorTab();
      return;
    }

    nluManager.openEditorTab(EditorTabs.UTTERANCE_RECOMMENDATIONS);
  };

  return (
    <>
      <div ref={stickyTopRef} />

      <Section
        suffix={
          <Box>
            {withRecommendations && (
              <Box mr={16} display="inline-block">
                <Badge
                  flat
                  style={{ fontSize: '13px', lineHeight: '16px', minHeight: '24px' }}
                  active={isRecommendationOpened}
                  onClick={toggleRecommendationTab}
                >
                  Recommend
                </Badge>
              </Box>
            )}
            <Box display="inline-flex" position="relative" top={2}>
              <TippyTooltip title="Bulk Import">
                <SvgIcon icon="upload" clickable onClick={stopPropagation(onBulkUploadClick)} />
              </TippyTooltip>
            </Box>
          </Box>
        }
        customContentStyling={{ marginBottom: intentUtterances.length ? 25 : 8, padding: 0 }}
        header={
          <>
            Utterances
            <Box marginLeft={16} display="inline-block" position="relative" bottom="3px">
              <StrengthGauge
                width={40}
                level={isBuiltIn ? StrengthGauge.Level.VERY_STRONG : getIntentStrengthLevel(intentUtterances.length)}
                tooltipLabelMap={{ [StrengthGauge.Level.NOT_SET]: 'No utterances' }}
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
              initialValue={{ text: prefilledNewUtterance || '', slots: [] }}
              maxVisibleItems={showAllUtterances ? intentUtterances.length : MAX_VISIBLE_UTTERANCES}
              renderList={({ mapManaged, itemRenderer }) => (
                <Box pt={!isValidUtterance && !intentUtterances.length ? 8 : 21} px={32}>
                  {mapManaged(itemRenderer)}
                </Box>
              )}
              items={intentUtterances}
              addToStart
              divider={false}
              beforeAdd={() => {
                if (intentID) {
                  trackingEvents.trackNewUtteranceCreated({ intentID, creationType: utteranceCreationType });
                }
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
              onUpdate={onUpdateUtterancesHandler}
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
