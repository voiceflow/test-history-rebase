import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Popper, { PopperContent, PopperFooter, PopperNav, PopperNavItem, PopperProps } from '@/components/Popper';
import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks';
import { MenuContent as ShareContent, SharePrototype as ShareFooter } from '@/pages/Canvas/header/ActionGroup/components/ShareProject/components';
import InviteContent from '@/pages/Collaborators';
import InviteFooter from '@/pages/Collaborators/components/InviteByLink';

import { ShareProjectTab } from '../../constants';
import { SharePopperContext } from '../../contexts';
import { ExportContent, ExportFooter } from './components';
import { ExportProvider } from './contexts';

interface SharePopperProps {
  children: PopperProps['children'];
}

const SharePopper: React.FC<SharePopperProps> = ({ children }) => {
  const sharePopper = React.useContext(SharePopperContext);

  const [canSharePrototype] = usePermission(Permission.SHARE_PROTOTYPE);
  const [canAddCollaborators] = usePermission(Permission.ADD_COLLABORATORS);

  const initialTab =
    sharePopper?.data?.defaultTab ??
    ((canAddCollaborators && ShareProjectTab.INVITE) || (canSharePrototype && ShareProjectTab.SHARE) || ShareProjectTab.EXPORT);

  return (
    <ExportProvider>
      <Popper
        width="620px"
        height="510px"
        opened={sharePopper?.opened}
        onClose={sharePopper?.close}
        initialTab={initialTab}
        preventOverflowPadding={24}
        renderNav={() => (
          <PopperNav>
            {canAddCollaborators && <PopperNavItem to={ShareProjectTab.INVITE}>Invite collaborators</PopperNavItem>}

            {canSharePrototype && <PopperNavItem to={ShareProjectTab.SHARE}>Share prototype</PopperNavItem>}

            <PopperNavItem to={ShareProjectTab.EXPORT}>Export as…</PopperNavItem>
          </PopperNav>
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
          <PopperFooter>
            <Switch>
              <Route path={ShareProjectTab.INVITE} render={() => <InviteFooter />} />
              <Route path={ShareProjectTab.SHARE} render={() => <ShareFooter compile inline />} />
              <Route path={ShareProjectTab.EXPORT} render={() => <ExportFooter />} />
            </Switch>
          </PopperFooter>
        )}
      >
        {children}
      </Popper>
    </ExportProvider>
  );
};

export default SharePopper;
