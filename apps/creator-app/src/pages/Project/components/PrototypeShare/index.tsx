import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { AssistantSharePrototypePopper } from '@/components/Assistant/AssistantSharePrototypePopper/AssistantSharePrototypePopper.component';
import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks';

export const PrototypeShare: React.FC = () => {
  const [canSharePrototype] = usePermission(Permission.PROJECT_PROTOTYPE_SHARE);

  return (
    <AssistantSharePrototypePopper
      referenceElement={({ ref, isOpen, onToggle }) => (
        <div ref={ref}>
          <Header.Button.Secondary
            label="Share prototype"
            onClick={onToggle}
            isActive={isOpen}
            disabled={!canSharePrototype}
          />
        </div>
      )}
    />
  );
};
