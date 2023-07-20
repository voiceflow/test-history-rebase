import { Button, ButtonVariant, Popper } from '@voiceflow/ui';
import React from 'react';

import * as Project from '@/components/Project';
import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks';
import { Identifier } from '@/styles/constants';

const Share: React.FC = () => {
  const [canSharePrototype] = usePermission(Permission.SHARE_PROTOTYPE);
  const [isClosePrevented, setIsClosedPrevented] = React.useState(false);

  const preventClose = React.useCallback(() => setIsClosedPrevented(true), []);
  const enableClose = React.useCallback(() => setIsClosedPrevented(false), []);

  return (
    <Popper
      width="438px"
      placement="bottom-end"
      preventClose={() => isClosePrevented}
      modifiers={{ offset: { offset: '0,8' } }}
      renderContent={() => (
        <Popper.Content>
          <Project.SharePrototype.Content preventClose={preventClose} enableClose={enableClose} />
        </Popper.Content>
      )}
      renderFooter={() => (
        <Popper.Footer>
          <Project.SharePrototype.Footer />
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
