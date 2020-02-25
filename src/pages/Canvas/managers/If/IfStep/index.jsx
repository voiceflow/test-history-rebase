import React from 'react';

import ExpressionPreview from '@/components/ExpressionEditor/components/ExpressionPreview';
import Step, { ElseItem, Item, Section } from '@/pages/Canvas/components/Step';
import { LabelVariant } from '@/pages/Canvas/components/Step/constants';

import { ExpressionPreviewContainer } from './components';

function IfStep({ expressions, onElseClickPort: onClickElsePort, isElseConnected, isActive }) {
  return (
    <Step isActive={isActive}>
      <Section>
        {expressions.length ? (
          expressions.map(({ onClickPort, value, isConnected }, index) => (
            <Item
              key={index}
              icon={index === 0 && 'if'}
              label={<ExpressionPreview expression={value} container={ExpressionPreviewContainer} />}
              labelVariant={LabelVariant.SECONDARY}
              iconColor="#f86683"
              isConnected={isConnected}
              onClickPort={onClickPort}
              placeholder="Add IF statement"
            />
          ))
        ) : (
          <Item icon="if" iconColor="#f86683" placeholder="Add IF statement" withPort={false} />
        )}
      </Section>

      <ElseItem onClickPort={onClickElsePort} isConnected={isElseConnected} />
    </Step>
  );
}

export default IfStep;
