import { tid } from '@voiceflow/style';
import { Popper, PopperTypes, stopPropagation } from '@voiceflow/ui';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import * as Project from '@/components/Project';
import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks';
import { useAssistantSessionStorageState } from '@/hooks/storage.hook';
import InviteContent from '@/pages/Project/components/Collaborators';
import InviteFooter from '@/pages/Project/components/Collaborators/components/InviteByLink';

import { ShareProjectTab } from '../../constants';
import { SharePopperContext } from '../../contexts';
import { Footer, Nav, NavItem } from './components';

interface SharePopperProps {
  children: PopperTypes.Children;
  placement?: PopperTypes.Placement;
  modifiers?: PopperTypes.Modifiers;
  preventOverflowPadding?: number;
}

const SharePopper: React.FC<SharePopperProps> = ({ children, placement, modifiers, preventOverflowPadding = 24 }) => {
  const TEST_ID = 'share-menu';

  const sharePopper = React.useContext(SharePopperContext);

  const [canSharePrototype] = usePermission(Permission.SHARE_PROTOTYPE);
  const [canAddCollaborators] = usePermission(Permission.ADD_COLLABORATORS);

  const [isClosePrevented, setIsClosedPrevented] = React.useState(false);

  const preventClose = React.useCallback(() => setIsClosedPrevented(true), []);
  const enableClose = React.useCallback(() => setIsClosedPrevented(false), []);

  const initialTab = (canSharePrototype && ShareProjectTab.PROTOTYPE) || ShareProjectTab.EXPORT;
  const [persistedTab, setPersistedTab] = useAssistantSessionStorageState('persisted_session_share_tab', initialTab);

  React.useEffect(() => {
    if (!sharePopper?.opened) {
      return;
    }

    // In the case where the persisted tab is a feature they don't have anymore
    const hasAccessToPersistedTab = (tab: ShareProjectTab) => {
      switch (tab) {
        case ShareProjectTab.PROTOTYPE:
          return canSharePrototype;
        case ShareProjectTab.INVITE:
          return canAddCollaborators;
        default:
          return true;
      }
    };

    if (sharePopper?.data?.defaultTab && hasAccessToPersistedTab(sharePopper.data.defaultTab)) {
      setPersistedTab(sharePopper.data.defaultTab);
    } else if (!hasAccessToPersistedTab(persistedTab)) {
      setPersistedTab(initialTab);
    }
  }, [sharePopper?.opened]);

  return (
    <Project.Export.Provider>
      <Popper
        width="635px"
        height="575px"
        opened={sharePopper?.opened}
        onClose={sharePopper?.close}
        placement={placement}
        modifiers={modifiers}
        initialTab={sharePopper?.data?.defaultTab ?? persistedTab}
        preventClose={() => isClosePrevented}
        onContainerClick={stopPropagation()}
        preventOverflowPadding={preventOverflowPadding}
        testID={TEST_ID}
        renderNav={() => (
          <Nav data-testid={tid(TEST_ID, 'navigation')}>
            {canSharePrototype && (
              <NavItem
                onClick={() => setPersistedTab(ShareProjectTab.PROTOTYPE)}
                to={ShareProjectTab.PROTOTYPE}
                data-testid={tid(TEST_ID, 'tab', 'share-prototype')}
              >
                Share prototype
              </NavItem>
            )}

            {canAddCollaborators && (
              <NavItem
                onClick={() => setPersistedTab(ShareProjectTab.INVITE)}
                to={ShareProjectTab.INVITE}
                data-testid={tid(TEST_ID, 'tab', 'invite-collaborators')}
              >
                Invite teammates
              </NavItem>
            )}

            <NavItem onClick={() => setPersistedTab(ShareProjectTab.EXPORT)} to={ShareProjectTab.EXPORT} data-testid={tid(TEST_ID, 'tab', 'export')}>
              Export as…
            </NavItem>
          </Nav>
        )}
        renderContent={() => (
          <Popper.Content>
            <Switch>
              <Route
                path={ShareProjectTab.PROTOTYPE}
                render={() => <Project.SharePrototype.Content preventClose={preventClose} enableClose={enableClose} />}
              />
              <Route path={ShareProjectTab.INVITE} render={() => <InviteContent />} />
              <Route path={ShareProjectTab.EXPORT} render={() => <Project.Export.Content />} />
            </Switch>
          </Popper.Content>
        )}
        renderFooter={() => (
          <Footer>
            <Switch>
              <Route path={ShareProjectTab.PROTOTYPE} render={() => <Project.SharePrototype.Footer isCanvas testID={tid(TEST_ID, 'prototype')} />} />
              <Route path={ShareProjectTab.INVITE} render={() => <InviteFooter />} />
              <Route path={ShareProjectTab.EXPORT} render={() => <Project.Export.Footer testID={tid(TEST_ID, 'export')} />} />
            </Switch>
          </Footer>
        )}
      >
        {children}
      </Popper>
    </Project.Export.Provider>
  );
};

export default SharePopper;
