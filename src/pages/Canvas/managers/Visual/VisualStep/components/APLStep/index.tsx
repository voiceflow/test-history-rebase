import { APLStepData, APLType } from '@voiceflow/general-types/build/nodes/visual';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { isVariable, transformVariablesToReadable } from '@/utils/slot';

export type APLStepProps = {
  image?: string | null;
  label?: string | null;
  portID?: string;
};

export const APLStep: React.FC<APLStepProps> = ({ label, portID, image }) => (
  <Step image={image}>
    <Section>
      <Item
        icon="blocks"
        label={label}
        portID={portID}
        iconColor="#3c6997"
        placeholder="Add a multimodal display"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedAPLStep: React.FC<ConnectedStepProps<APLStepData>> = ({ node, data }) => {
  const label = data.aplType === APLType.SPLASH ? transformVariablesToReadable(data.title) : data.jsonFileName;
  const image = isVariable(data.imageURL) ? null : data.imageURL;

  return <APLStep portID={node.ports.out[0]} label={label} image={image} />;
};

export default ConnectedAPLStep;
