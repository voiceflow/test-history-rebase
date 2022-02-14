import React from 'react';

import Popper, { PopperContent } from '@/components/Popper';
import ProtoTypeSettings from '@/pages/Prototype/components/PrototypeSettings';

import { SettingsButton } from './components';

const PrototypeHeaderSettings: React.FC = () => (
  <Popper
    width="349px"
    placement="bottom"
    modifiers={{ offset: { offset: '0,8' } }}
    renderContent={() => (
      <PopperContent>
        <ProtoTypeSettings />
      </PopperContent>
    )}
  >
    {({ ref, onToggle, isOpened }) => <SettingsButton ref={ref} onClick={onToggle} icon="cog" isActive={isOpened} />}
  </Popper>
);

export default PrototypeHeaderSettings;
