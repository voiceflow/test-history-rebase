import { Button } from '@voiceflow/base-types';
import { PlanType, PlatformType } from '@voiceflow/internal';
import { DEVICE_INFO, FullSpinner, toast } from '@voiceflow/ui';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { RemoveIntercom } from '@/components/IntercomChat';
import SeoHelmet from '@/components/SeoHelmet';
import { Permission } from '@/config/permissions';
import { SeoPage } from '@/constants/seo';
import * as PrototypeDuck from '@/ducks/prototype';
import { connect } from '@/hocs';
import { useGuestPermission, useSetup, useToggle, useTrackingEvents } from '@/hooks';
import { ConnectedProps } from '@/types';

import { Prototype } from './components';
import PasswordScreen from './components/PasswordScreen';

const PublicPrototype: React.FC<ConnectedPublicPrototypeProps & RouteComponentProps<{ versionID: string }>> = ({
  match,
  setupPublicPrototype,
  updatePrototype,
  checkSharedProtoPassword,
}) => {
  const [isLoaded, toggleLoaded] = useToggle(false);
  const [settings, setSettings] = React.useState<PrototypeDuck.PrototypeSettings>({
    plan: PlanType.STARTER,
    layout: PrototypeDuck.PrototypeLayout.TEXT_DIALOG,
    buttons: Button.ButtonsLayout.STACKED,
    locales: [],
    platform: PlatformType.GENERAL,
    hasPassword: false,
    projectName: '',
  });

  const [isAuthenticated, setAuthenticated] = React.useState<boolean>(false);
  const [trackingEvents] = useTrackingEvents();

  const [isAllowedPassword] = useGuestPermission(settings.plan, Permission.SHARE_PROTOTYPE_PASSWORD);

  const canUseSharedPassword = React.useMemo(() => isAllowedPassword && settings.hasPassword, [isAllowedPassword && settings]);

  useSetup(async () => {
    const { versionID } = match.params;

    try {
      const prototypeSettings = await setupPublicPrototype(versionID);

      trackingEvents.trackPublicPrototypeView({
        layout: prototypeSettings.layout,
        device: DEVICE_INFO.platform ?? 'unknown',
        versionID,
      });

      updatePrototype({ platform: prototypeSettings.platform });
      setSettings(prototypeSettings);
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
  updatePrototype: PrototypeDuck.updatePrototype,
};

type ConnectedPublicPrototypeProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(PublicPrototype);
