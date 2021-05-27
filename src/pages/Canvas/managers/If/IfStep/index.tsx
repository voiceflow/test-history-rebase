import React from 'react';

import ExpressionPreview from '@/components/ExpressionEditor/components/ExpressionPreview';
import Text from '@/components/Text';
import { FeatureFlag } from '@/config/features';
import { StepLabelVariant } from '@/constants/canvas';
import { useFeature, useSyncedLookup } from '@/hooks';
import { ExpressionData, LogicGroupData, NodeData } from '@/models';
import Step, { ConnectedStepProps, ElseItem, Item, Section } from '@/pages/Canvas/components/Step';
import { head } from '@/utils/array';
import { expressionPreview } from '@/utils/expression';

import { NODE_CONFIG } from '../constants';
import { ExpressionPreviewContainer } from './components';

export type IfStepProps = {
  nodeID: string;
  elsePortID: string;
  expressions: {
    name?: string;
    label: JSX.Element | null;
    portID: string;
  }[];
};

export const IfStep: React.FC<IfStepProps> = ({ expressions, nodeID, elsePortID }) => {
  const conditionsBuilder = useFeature(FeatureFlag.CONDITIONS_BUILDER);
  return (
    <Step nodeID={nodeID}>
      <Section>
        {/* eslint-disable-next-line no-nested-ternary */}
        {expressions.length ? (
          expressions.map(({ label, name, portID }, index) =>
            conditionsBuilder.isEnabled ? (
              <Item
                multilineLabel
                key={portID}
                label={name || label}
                icon={index === 0 ? NODE_CONFIG.icon : null}
                placeholder="Name conditional path"
                iconColor={NODE_CONFIG.iconColor}
                portID={portID}
              />
            ) : (
              <Item
                key={portID}
                icon={index === 0 ? NODE_CONFIG.icon : null}
                label={label}
                labelVariant={StepLabelVariant.SECONDARY}
                iconColor={NODE_CONFIG.iconColor}
                portID={portID}
                placeholder="Add IF statement"
              />
            )
          )
        ) : (
          <Item icon="if" iconColor="#f86683" placeholder="Add a Condition" />
        )}
      </Section>
      <ElseItem portID={elsePortID} />
    </Step>
  );
};

type ConnectedIfStepProps = ConnectedStepProps<NodeData.If>;

const ConnectedIfStep: React.FC<ConnectedIfStepProps> = ({ node, data }) => {
  const [elsePortID, nodeOutPorts] = React.useMemo(() => head(node.ports.out), [node.ports.out]);
  const expressionsByPortID = useSyncedLookup(nodeOutPorts, data.expressions);
  const conditionsBuilder = useFeature(FeatureFlag.CONDITIONS_BUILDER);

  const expressions = nodeOutPorts
    .filter((portID) => expressionsByPortID[portID])
    .map((portID) => {
      const expression = expressionsByPortID[portID];

      return {
        name: expression.name,
        // eslint-disable-next-line no-nested-ternary
        label: conditionsBuilder.isEnabled ? (
          (expression as ExpressionData).value.length > 0 ? (
            <Text>{expressionPreview(expression as ExpressionData | LogicGroupData)}</Text>
          ) : null
        ) : (
          <ExpressionPreview expression={expression} container={ExpressionPreviewContainer} singleLine />
        ),
        portID,
      };
    });

  return <IfStep expressions={expressions} nodeID={node.id} elsePortID={elsePortID} />;
};

export default ConnectedIfStep;
