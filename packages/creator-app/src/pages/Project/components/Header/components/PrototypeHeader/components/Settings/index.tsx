import React from 'react';

import Popper, { PopperContent } from '@/components/Popper';
import ProtoTypeSettings from '@/pages/Prototype/components/PrototypeSettings';

import { ShareButton } from './components';

const PrototypeHeaderSettings: React.FC<{}> = () => {
  return (
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
      {({ ref, onToggle }) => <ShareButton ref={ref} onClick={onToggle} icon="cog" />}
    </Popper>
  );
};

export default PrototypeHeaderSettings;
