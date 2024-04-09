import { Header, Popper, Surface } from '@voiceflow/ui-next';
import React from 'react';

import ProtoTypeSettings from '@/pages/Prototype/components/PrototypeSettings';

export const DiagramLayoutHeaderPrototypeSettings: React.FC = () => {
  return (
    <Popper
      referenceElement={({ ref, isOpen, onToggle }) => (
        <div ref={ref}>
          <Header.Button.IconSecondary iconName="Settings" isActive={isOpen} onClick={onToggle} />
        </div>
      )}
    >
      {() => (
        <Surface width={350} overflow="hidden">
          <ProtoTypeSettings />
        </Surface>
      )}
    </Popper>
  );
};
