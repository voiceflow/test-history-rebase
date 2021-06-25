import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import Popper, { PopperContent, PopperFooter } from '@/components/Popper';
import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks';
import { MenuContent as ShareContent, SharePrototype as ShareFooter } from '@/pages/Canvas/header/ActionGroup/components/ShareProject/components';
import { Identifier } from '@/styles/constants';

const Share: React.FC = () => {
  const [canSharePrototype] = usePermission(Permission.SHARE_PROTOTYPE);

  return (
    <Popper
      width="438px"
      placement="bottom-end"
      modifiers={{ offset: { offset: '0,8' } }}
      renderContent={() => (
        <PopperContent>
          <ShareContent inline />
        </PopperContent>
      )}
      renderFooter={() => (
        <PopperFooter>
          <ShareFooter inline />
        </PopperFooter>
      )}
    >
      {({ ref, onToggle, isOpened }) => (
        <Button
          id={Identifier.SHARE_BUTTON}
          ref={ref}
          flat
          variant={ButtonVariant.SECONDARY}
          onClick={onToggle}
          disabled={!canSharePrototype}
          isActive={isOpened}
        >
          Share Prototype
        </Button>
      )}
    </Popper>
  );
};

export default Share;
