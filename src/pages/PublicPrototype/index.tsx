import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { RemoveIntercom } from '@/components/IntercomChat';
import { FullSpinner } from '@/components/Spinner';
import { toast } from '@/components/Toast';
import { Permission } from '@/config/permissions';
import * as PrototypeDuck from '@/ducks/prototype';
import * as WorkspaceDuck from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useGuestPermission, useSetup, useToggle } from '@/hooks';
import { ConnectedProps } from '@/types';

import { Prototype } from './components';
import PasswordScreen from './components/PasswordScreen';

const PublicPrototype: React.FC<ConnectedPublicPrototypeProps & RouteComponentProps<{ versionID: string }>> = ({
  match,
  setupPublicPrototype,
  fetchWorkspaces,
  checkSharedProtoPassword,
}) => {
  const [isLoaded, toggleLoaded] = useToggle(false);
  const [settings, setSettings] = React.useState<PrototypeDuck.PrototypeSettings>({
    layout: PrototypeDuck.PrototypeLayout.TEXT_DIALOG,
    hasPassword: false,
  });
  const [isAuthenticated, setAuthenticated] = React.useState<boolean>(false);

  const [hasPermission] = useGuestPermission(Permission.SHARE_PROTOTYPE_PASSWORD);
  const canUseSharedPassword = React.useMemo(() => hasPermission && settings.hasPassword, [hasPermission, settings.hasPassword]);

  useSetup(async () => {
    const { versionID } = match.params;

    try {
      const prototypeLayout = await setupPublicPrototype(versionID);

      setSettings(prototypeLayout);
    } catch {
      toast.error("Prototype hasn't been shared or doesn't exist");
    }

    try {
      await fetchWorkspaces(true);
    } catch {
      toast.error('Unable to fetch workspace permissions');
    }

    toggleLoaded(true);
  });

  const checkLogin = React.useCallback(
    async (password: string) => {
      const isAuth = await checkSharedProtoPassword(match.params.versionID, password);
      setAuthenticated(isAuth);
      if (!isAuth) toast.error('Invalid password');
    },
    [setAuthenticated, settings]
  );

  return isLoaded ? (
    <>
      <RemoveIntercom />
      {isAuthenticated || !canUseSharedPassword ? <Prototype settings={settings} /> : <PasswordScreen settings={settings} checkLogin={checkLogin} />}
    </>
  ) : (
    <FullSpinner name="Prototype" />
  );
};

const mapDispatchToProps = {
  setupPublicPrototype: PrototypeDuck.setupPublicPrototype,
  fetchWorkspaces: WorkspaceDuck.fetchWorkspaces,
  checkSharedProtoPassword: PrototypeDuck.checkSharedProtoPassword,
};

type ConnectedPublicPrototypeProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(PublicPrototype);
