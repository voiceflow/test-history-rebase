import { Button, ButtonVariant, Popper } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks';
import { PrototypeContent, PrototypeFooter } from '@/pages/Project/components/Header/components/SharePopper/components';
import { Identifier } from '@/styles/constants';

const Share: React.OldFC = () => {
  const [canSharePrototype] = usePermission(Permission.SHARE_PROTOTYPE);

  return (
    <Popper
      width="438px"
      placement="bottom-end"
      modifiers={{ offset: { offset: '0,8' } }}
      renderContent={() => (
        <Popper.Content>
          <PrototypeContent />
        </Popper.Content>
      )}
      renderFooter={() => (
        <Popper.Footer>
          <PrototypeFooter />
        </Popper.Footer>
      )}
    >
      {({ ref, onToggle }) => (
        <Button id={Identifier.SHARE_BUTTON} ref={ref} variant={ButtonVariant.PRIMARY} onClick={onToggle} disabled={!canSharePrototype}>
          Share Prototype
        </Button>
      )}
    </Popper>
  );
};

export default Share;
