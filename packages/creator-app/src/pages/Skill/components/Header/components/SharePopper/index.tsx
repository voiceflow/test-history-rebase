import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Popper, { PopperContent, PopperProps } from '@/components/Popper';
import { Permission } from '@/config/permissions';
import * as Session from '@/ducks/session';
import { usePermission, useSelector, useSessionStorageState } from '@/hooks';
import { MenuContent as ShareContent, SharePrototype as ShareFooter } from '@/pages/Canvas/header/ActionGroup/components/ShareProject/components';
import InviteContent from '@/pages/Collaborators';
import InviteFooter from '@/pages/Collaborators/components/InviteByLink';

import { ShareProjectTab } from '../../constants';
import { SharePopperContext } from '../../contexts';
import { ExportContent, ExportFooter, ExportNavItem, ExportPopperFooter, ExportPopperNav } from './components';
import { ExportProvider } from './contexts';

interface SharePopperProps {
  children: PopperProps['children'];
}
const PERSISTED_SESSION_SHARE_TAB = 'persisted_session_share_tab';

const SharePopper: React.FC<SharePopperProps> = ({ children }) => {
  const sharePopper = React.useContext(SharePopperContext);
  const activeProjectID = useSelector(Session.activeProjectIDSelector);

  const [canSharePrototype] = usePermission(Permission.SHARE_PROTOTYPE);
  const [canAddCollaborators] = usePermission(Permission.ADD_COLLABORATORS);

  const initialTab = (canAddCollaborators && ShareProjectTab.INVITE) || (canSharePrototype && ShareProjectTab.SHARE) || ShareProjectTab.EXPORT;
  const [persistedTab, setPersistedTab] = useSessionStorageState(`${PERSISTED_SESSION_SHARE_TAB}-${activeProjectID}`, initialTab);

  React.useEffect(() => {
    if (!sharePopper?.opened) {
      return;
    }

    // In the case where the persisted tab is a feature they don't have anymore
    const hasAccessToPersistedTab = (tab: ShareProjectTab) => {
      switch (tab) {
        case ShareProjectTab.SHARE:
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
    <ExportProvider>
      <Popper
        width="620px"
        height="510px"
        opened={sharePopper?.opened}
        onClose={sharePopper?.close}
        initialTab={sharePopper?.data?.defaultTab ?? persistedTab}
        preventOverflowPadding={24}
        renderNav={() => (
          <ExportPopperNav>
            {canAddCollaborators && (
              <ExportNavItem onClick={() => setPersistedTab(ShareProjectTab.INVITE)} to={ShareProjectTab.INVITE}>
                Invite collaborators
              </ExportNavItem>
            )}

            {canSharePrototype && (
              <ExportNavItem onClick={() => setPersistedTab(ShareProjectTab.SHARE)} to={ShareProjectTab.SHARE}>
                Share prototype
              </ExportNavItem>
            )}

            <ExportNavItem onClick={() => setPersistedTab(ShareProjectTab.EXPORT)} to={ShareProjectTab.EXPORT}>
              Export as…
            </ExportNavItem>
          </ExportPopperNav>
        )}
        renderContent={() => (
          <PopperContent>
            <Switch>
              <Route path={ShareProjectTab.INVITE} render={() => <InviteContent inline />} />
              <Route path={ShareProjectTab.SHARE} render={() => <ShareContent inline />} />
              <Route path={ShareProjectTab.EXPORT} render={() => <ExportContent />} />
            </Switch>
          </PopperContent>
        )}
        renderFooter={() => (
          <ExportPopperFooter>
            <Switch>
              <Route path={ShareProjectTab.INVITE} render={() => <InviteFooter />} />
              <Route path={ShareProjectTab.SHARE} render={() => <ShareFooter compile inline />} />
              <Route path={ShareProjectTab.EXPORT} render={() => <ExportFooter />} />
            </Switch>
          </ExportPopperFooter>
        )}
      >
        {children}
      </Popper>
    </ExportProvider>
  );
};

export default SharePopper;
