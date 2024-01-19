import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { StepButton, StepLabelRow } from '@/pages/Canvas/components/Step';
import { ActiveDiagramNormalizedEntitiesAndVariablesContext } from '@/pages/Canvas/contexts';
import { ClassName } from '@/styles/constants';
import { transformVariablesToReadable } from '@/utils/slot';

import StepPreview from './StepPreview';
import { BaseStepProps } from './types';

interface VoiceStepProps extends BaseStepProps {
  item: Realtime.SSMLData;
}

const VoiceStep: React.FC<VoiceStepProps> = ({ item, nextPortID, onOpenEditor, attachmentItems }) => {
  const entitiesAndVariables = React.useContext(ActiveDiagramNormalizedEntitiesAndVariablesContext)!;

  const prettifiedContent = React.useMemo(
    () => Utils.string.stripHTMLTags(transformVariablesToReadable(item.content, entitiesAndVariables.byKey)),
    [item.content, entitiesAndVariables.byKey]
  );

  const stepLabel = prettifiedContent && (
    <StepLabelRow>
      {prettifiedContent}{' '}
      {!!attachmentItems.length && (
        <Popper
          placement="right-start"
          renderContent={({ onClose }) => <StepPreview items={attachmentItems} onClose={onClose} onOpenEditor={onOpenEditor} />}
        >
          {({ onToggle, ref, isOpened }) => (
            <StepButton ref={ref} onClick={stopPropagation(onToggle)} icon="randomV2" isActive={isOpened} style={{ marginBottom: 0, marginTop: 0 }} />
          )}
        </Popper>
      )}
    </StepLabelRow>
  );

  return (
    <Step.StepItemContainer className={ClassName.CANVAS_STEP_ITEM} pb={attachmentItems.length ? 16 : 12}>
      <Step.StepLabelTextContainer variant={stepLabel ? StepLabelVariant.PRIMARY : StepLabelVariant.PLACEHOLDER}>
        <Step.StepLabelText multiline lineClamp={100} withNewLines className={ClassName.CANVAS_STEP_ITEM_LABEL}>
          {stepLabel || 'Enter speak reply'}
        </Step.StepLabelText>
      </Step.StepLabelTextContainer>

      <Step.StepPort portID={nextPortID} />
    </Step.StepItemContainer>
  );
};

export default VoiceStep;
