import { Popper } from '@voiceflow/ui';
import React from 'react';

import ProtoTypeSettings from '@/pages/Prototype/components/PrototypeSettings';

import { SettingsButton } from './components';

const PrototypeHeaderSettings: React.FC = () => (
  <Popper
    width="349px"
    placement="bottom"
    modifiers={{ offset: { offset: '0,8' } }}
    renderContent={() => (
      <Popper.Content>
        <ProtoTypeSettings />
      </Popper.Content>
    )}
  >
    {({ ref, onToggle, isOpened }) => <SettingsButton ref={ref} onClick={onToggle} icon="systemSettings" isActive={isOpened} />}
  </Popper>
);

export default PrototypeHeaderSettings;
