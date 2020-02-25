import React from 'react';

import ExpressionPreview from '@/components/ExpressionEditor/components/ExpressionPreview';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { LabelVariant } from '@/pages/Canvas/components/Step/constants';
import { ExpressionPreviewContainer } from '@/pages/Canvas/managers/If/IfStep/components';

const SetStep = ({ expressions, onClickPort, isActive, isConnected, withPort = true }) => (
  <Step isActive={isActive}>
    <Section>
      {expressions.length ? (
        expressions.map((value, index) => (
          <Item
            label={<ExpressionPreview expression={value} container={ExpressionPreviewContainer} />}
            isConnected={isConnected}
            onClickPort={onClickPort}
            labelVariant={LabelVariant.SECONDARY}
            icon={index === 0 && 'code'}
            iconColor="#5590b5"
            key={index}
            withPort={index === expressions.length - 1 && withPort}
            placeholder="Set variable to..."
          />
        ))
      ) : (
        <Item icon="code" iconColor="#5590b5" placeholder="Set variable to..." withPort={withPort} />
      )}
    </Section>
  </Step>
);

export default SetStep;
