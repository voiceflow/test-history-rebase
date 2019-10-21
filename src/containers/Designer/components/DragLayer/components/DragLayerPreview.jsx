import React from 'react';

import StepDragPreview from '@/containers/Designer/components/Step/components/StepDragPreview';
import UtteranceStepDragPreview from '@/containers/Designer/components/UtteranceStep/components/UtteranceStepDragPreview';
import { DragTargetType } from '@/containers/Designer/constants';

const DragLayerPreview = ({ item }) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (item.stepType) {
    case DragTargetType.STEP:
      return <StepDragPreview {...item} />;
    case DragTargetType.UTTERANCE_STEP:
      return <UtteranceStepDragPreview {...item} />;
    default:
      return null;
  }
};

export default DragLayerPreview;
