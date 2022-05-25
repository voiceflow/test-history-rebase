import { Utils } from '@voiceflow/common';
import { Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { DialogType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { StepButton, StepLabelRow } from '@/pages/Canvas/components/Step';
import { ClassName } from '@/styles/constants';
import { transformVariablesToReadable } from '@/utils/slot';

import { SpeakStepItem, SpeakStepProps } from '../../types';
import VoiceDialogPreview from '../VoiceDialogPreview';

const SPEAK_PLACEHOLDER = 'Enter speak reply';

const transformContent = (content?: string | null) => (content ? Utils.string.stripHTMLTags(transformVariablesToReadable(content)) : null);

export const VoiceDialogStep: React.FC<SpeakStepProps & SpeakStepItem> = ({ random, content, nextPortID, isLastItem, items, onOpenEditor }) => {
  const voiceItems = React.useMemo(
    () =>
      items.filter((item) => item.content && item.type === DialogType.VOICE).map((item) => ({ ...item, content: transformContent(item.content) })),
    [items]
  );
  const shouldRenderAttachment = voiceItems.length > 1 && random;
  const label = transformContent(content);

  const attachment = (
    <Popper
      placement="right-start"
      borderRadius="8px"
      renderContent={({ onClose }) => <VoiceDialogPreview onClose={onClose} onOpenEditor={onOpenEditor} speakVariants={voiceItems} />}
    >
      {({ onToggle, ref, isOpened }) => (
        <StepButton ref={ref} onClick={stopPropagation(onToggle)} icon="randomV2" isActive={isOpened} style={{ marginBottom: 0, marginTop: 0 }} />
      )}
    </Popper>
  );

  const stepLabel = label && (
    <StepLabelRow>
      {label} {shouldRenderAttachment && attachment}
    </StepLabelRow>
  );

  return (
    <Step.StepItemContainer className={ClassName.CANVAS_STEP_ITEM} style={{ padding: '12px 16px 12px 22px' }}>
      <Step.StepLabelTextContainer variant={stepLabel ? StepLabelVariant.PRIMARY : StepLabelVariant.PLACEHOLDER}>
        <Step.StepLabelText multiline lineClamp={100} withNewLines className={ClassName.CANVAS_STEP_ITEM_LABEL}>
          {stepLabel || SPEAK_PLACEHOLDER}
        </Step.StepLabelText>
      </Step.StepLabelTextContainer>
      <Step.StepPort portID={isLastItem ? nextPortID : null} />
    </Step.StepItemContainer>
  );
};

export default VoiceDialogStep;
