import { Popper, PopperTypes, useSessionStorageState } from '@voiceflow/ui';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import * as Project from '@/components/Project';
import { Permission } from '@/constants/permissions';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import { usePermission, useSelector } from '@/hooks';
import InviteContent from '@/pages/Project/components/Collaborators';
import InviteFooter from '@/pages/Project/components/Collaborators/components/InviteByLink';

import { ShareProjectTab } from '../../constants';
import { SharePopperContext } from '../../contexts';
import { Footer, Nav, NavItem } from './components';

interface SharePopperProps {
  children: PopperTypes.Children;
}

const PERSISTED_SESSION_SHARE_TAB = 'persisted_session_share_tab';

const SharePopper: React.FC<SharePopperProps> = ({ children }) => {
  const sharePopper = React.useContext(SharePopperContext);
  const activeProjectID = useSelector(Session.activeProjectIDSelector);

  const [canSharePrototype] = usePermission(Permission.SHARE_PROTOTYPE);
  const [canAddCollaborators] = usePermission(Permission.ADD_COLLABORATORS);

  const [isClosePrevented, setIsClosedPrevented] = React.useState(false);

  const preventClose = React.useCallback(() => setIsClosedPrevented(true), []);
  const enableClose = React.useCallback(() => setIsClosedPrevented(false), []);

  const initialTab = (canSharePrototype && ShareProjectTab.PROTOTYPE) || ShareProjectTab.EXPORT;
  const [persistedTab, setPersistedTab] = useSessionStorageState(`${PERSISTED_SESSION_SHARE_TAB}-${activeProjectID}`, initialTab);

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
        preventClose={() => isClosePrevented}
        opened={sharePopper?.opened}
        onClose={sharePopper?.close}
        initialTab={sharePopper?.data?.defaultTab ?? persistedTab}
        preventOverflowPadding={24}
        renderNav={() => (
          <Nav>
            {canSharePrototype && (
              <NavItem onClick={() => setPersistedTab(ShareProjectTab.PROTOTYPE)} to={ShareProjectTab.PROTOTYPE}>
                Share prototype
              </NavItem>
            )}

            {canAddCollaborators && (
              <NavItem onClick={() => setPersistedTab(ShareProjectTab.INVITE)} to={ShareProjectTab.INVITE}>
                Invite teammates
              </NavItem>
            )}

            <NavItem onClick={() => setPersistedTab(ShareProjectTab.EXPORT)} to={ShareProjectTab.EXPORT}>
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
              <Route path={ShareProjectTab.PROTOTYPE} render={() => <Project.SharePrototype.Footer isCanvas />} />
              <Route path={ShareProjectTab.INVITE} render={() => <InviteFooter />} />
              <Route path={ShareProjectTab.EXPORT} render={() => <Project.Export.Footer origin={Tracking.ModelExportOriginType.SHARE_MENU} />} />
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
