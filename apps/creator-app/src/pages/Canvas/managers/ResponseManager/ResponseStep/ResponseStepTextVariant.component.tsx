import { TextResponseVariant } from '@voiceflow/dtos';
import { isMarkupEmpty } from '@voiceflow/utils-designer';
import React from 'react';

import { SlatePreviewWithVariables } from '@/components/State/SlatePreviewWithVariables';
import { HSLShades } from '@/constants';
import Step from '@/pages/Canvas/components/Step';
import { markupToSlate } from '@/utils/markup.util';

export interface IResponseStepTextVariantProps {
  variant: TextResponseVariant;
  nextPortID?: string;
  palette: HSLShades;
  nodeID: string;
}

export const ResponseStepTextVariant = ({ variant, nextPortID, palette, nodeID }: IResponseStepTextVariantProps) => {
  const value = React.useMemo(() => markupToSlate.fromDB(variant.text), [variant.text]);

  return (
    <Step nodeID={nodeID} dividerOffset={22}>
      <Step.Section v2>
        <Step.Item placeholder="Enter agent says" portID={nextPortID} palette={palette} v2>
          {isMarkupEmpty(variant.text) ? null : <SlatePreviewWithVariables value={value} />}
        </Step.Item>
      </Step.Section>
    </Step>
  );
};
