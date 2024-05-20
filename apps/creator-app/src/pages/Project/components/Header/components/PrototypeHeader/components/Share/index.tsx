import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { Button, ButtonVariant, Popper } from '@voiceflow/ui';
import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { AssistantSharePrototypePopper } from '@/components/Assistant/AssistantSharePrototypePopper/AssistantSharePrototypePopper.component';
import * as Project from '@/components/Project';
import { Permission } from '@/constants/permissions';
import { useFeature, usePermission } from '@/hooks';
import { Identifier } from '@/styles/constants';

const Share: React.FC = () => {
  const cmsWorkflows = useFeature(FeatureFlag.CMS_WORKFLOWS);
  const [canSharePrototype] = usePermission(Permission.SHARE_PROTOTYPE);
  const [isClosePrevented, setIsClosedPrevented] = React.useState(false);

  const preventClose = React.useCallback(() => setIsClosedPrevented(true), []);
  const enableClose = React.useCallback(() => setIsClosedPrevented(false), []);

  if (cmsWorkflows.isEnabled) {
    return (
      <AssistantSharePrototypePopper
        referenceElement={({ ref, isOpen, onToggle }) => (
          <div ref={ref}>
            <Header.Button.Primary
              label="Share prototype"
              onClick={onToggle}
              isActive={isOpen}
              disabled={!canSharePrototype}
            />
          </div>
        )}
      />
    );
  }

  return (
    <Popper
      width="438px"
      placement="bottom-end"
      preventClose={() => isClosePrevented}
      modifiers={{ offset: { offset: '0,8' } }}
      renderContent={() => (
        <Popper.Content>
          <Project.SharePrototype.Content
            preventClose={preventClose}
            enableClose={enableClose}
            disableAnimation={cmsWorkflows.isEnabled}
          />
        </Popper.Content>
      )}
      renderFooter={() => (
        <Popper.Footer>
          <Project.SharePrototype.Footer />
        </Popper.Footer>
      )}
    >
      {({ ref, onToggle }) => (
        <Button
          id={Identifier.SHARE_BUTTON}
          ref={ref}
          variant={ButtonVariant.PRIMARY}
          onClick={onToggle}
          disabled={!canSharePrototype}
        >
          Share Prototype
        </Button>
      )}
    </Popper>
  );
};

export default Share;
