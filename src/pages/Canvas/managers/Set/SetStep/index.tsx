import React from 'react';

import ExpressionPreview from '@/components/ExpressionEditor/components/ExpressionPreview';
import { FeatureFlag } from '@/config/features';
import { StepLabelVariant } from '@/constants/canvas';
import { useFeature } from '@/hooks';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { ExpressionPreviewContainer } from '@/pages/Canvas/managers/If/IfStep/components';

import { NODE_CONFIG } from '../constants';

export type SetStepProps = {
  expressions: (JSX.Element | null)[];
  nodeID: string;
  portID: string;
  title?: string;
};

export const SetStep: React.FC<SetStepProps> = ({ title, expressions, nodeID, portID }) => {
  const conditionsBuilder = useFeature(FeatureFlag.CONDITIONS_BUILDER);

  return (
    <Step nodeID={nodeID}>
      <Section>
        {/* eslint-disable-next-line no-nested-ternary */}
        {conditionsBuilder.isEnabled ? (
          <Item
            multilineLabel
            label={title || ''}
            labelVariant={StepLabelVariant.SECONDARY}
            icon={NODE_CONFIG.icon}
            iconColor={NODE_CONFIG.iconColor}
            portID={portID}
            placeholder="Name Set step"
          />
        ) : expressions.length ? (
          expressions.map((label, index) => (
            <Item
              label={label}
              labelVariant={StepLabelVariant.SECONDARY}
              icon={index === 0 ? NODE_CONFIG.icon : null}
              iconColor={NODE_CONFIG.iconColor}
              key={index}
              portID={index === expressions.length - 1 ? portID : null}
              placeholder="Set variable to..."
            />
          ))
        ) : (
          <Item icon={NODE_CONFIG.icon} iconColor={NODE_CONFIG.iconColor} placeholder="Set variable to..." portID={portID} />
        )}
      </Section>
    </Step>
  );
};

type ConnectedSetStepProps = ConnectedStepProps<NodeData.Set>;

const ConnectedSetStep: React.FC<ConnectedSetStepProps> = ({ data, node }) => {
  const expressions = data.sets.map(({ variable, expression }) =>
    variable ? <ExpressionPreview prefix={`{${variable}} = `} expression={expression} container={ExpressionPreviewContainer} singleLine /> : null
  );

  return <SetStep title={data.title} expressions={expressions} nodeID={node.id} portID={node.ports.out[0]} />;
};

export default ConnectedSetStep;
