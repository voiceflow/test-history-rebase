import React from 'react';

import Step, { ElseItem, Item, Section } from '@/pages/Canvas/components/Step';

function ChoiceStep({ choices, onElseClickPort: onClickElsePort, isElseConnected, isActive }) {
  return (
    <Step isActive={isActive}>
      {!!choices.length && (
        <Section>
          {choices.map(({ onClickPort, label, isConnected }, index) => {
            return (
              <Item
                onClickPort={onClickPort}
                icon={index === 0 && 'choice'}
                iconColor="#3a5999"
                key={index}
                label={label}
                isConnected={isConnected}
              />
            );
          })}
        </Section>
      )}
      <ElseItem onClickPort={onClickElsePort} isConnected={isElseConnected} />
    </Step>
  );
}

export default ChoiceStep;
