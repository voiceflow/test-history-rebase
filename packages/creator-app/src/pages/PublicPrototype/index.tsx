import { ButtonsLayout } from '@voiceflow/general-types';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { RemoveIntercom } from '@/components/IntercomChat';
import SeoHelmet from '@/components/SeoHelmet';
import { FullSpinner } from '@/components/Spinner';
import { toast } from '@/components/Toast';
import { Permission } from '@/config/permissions';
import { PlanType } from '@/constants';
import { SeoPage } from '@/constants/seo';
import * as PrototypeDuck from '@/ducks/prototype';
import { connect } from '@/hocs';
import { useGuestPermission, useSetup, useToggle } from '@/hooks';
import { ConnectedProps } from '@/types';

import { Prototype } from './components';
import PasswordScreen from './components/PasswordScreen';

const PublicPrototype: React.FC<ConnectedPublicPrototypeProps & RouteComponentProps<{ versionID: string }>> = ({
  match,
  setupPublicPrototype,
  checkSharedProtoPassword,
}) => {
  const [isLoaded, toggleLoaded] = useToggle(false);
  const [settings, setSettings] = React.useState<PrototypeDuck.PrototypeSettings>({
    plan: PlanType.STARTER,
    locales: [],
    layout: PrototypeDuck.PrototypeLayout.TEXT_DIALOG,
    projectName: '',
    hasPassword: false,
    buttons: ButtonsLayout.STACKED,
  });

  const [isAuthenticated, setAuthenticated] = React.useState<boolean>(false);

  const [isAllowedPassword] = useGuestPermission(settings.plan, Permission.SHARE_PROTOTYPE_PASSWORD);
  const canUseSharedPassword = React.useMemo(() => isAllowedPassword && settings.hasPassword, [isAllowedPassword && settings]);

  useSetup(async () => {
    const { versionID } = match.params;

    try {
      const prototypeLayout = await setupPublicPrototype(versionID);

      setSettings(prototypeLayout);
    } catch {
      toast.error("Prototype hasn't been shared or doesn't exist");
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
      <SeoHelmet page={SeoPage.PROTOTYPE} />
      {isAuthenticated || !canUseSharedPassword ? <Prototype settings={settings} /> : <PasswordScreen settings={settings} checkLogin={checkLogin} />}
    </>
  ) : (
    <FullSpinner name="Prototype" />
  );
};

const mapDispatchToProps = {
  setupPublicPrototype: PrototypeDuck.setupPublicPrototype,
  checkSharedProtoPassword: PrototypeDuck.checkSharedProtoPassword,
};

type ConnectedPublicPrototypeProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(PublicPrototype);
