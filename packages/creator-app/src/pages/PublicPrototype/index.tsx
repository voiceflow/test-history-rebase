import { BaseButton } from '@voiceflow/base-types';
import { PlanType } from '@voiceflow/internal';
import { DEVICE_INFO, FullSpinner, toast, withProvider } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { RemoveIntercom } from '@/components/IntercomChat';
import SeoHelmet from '@/components/SeoHelmet';
import { Permission } from '@/config/permissions';
import { SeoPage } from '@/constants/seo';
import * as PrototypeDuck from '@/ducks/prototype';
import { useDispatch, useGuestPermission, useSelector, useSetup, useToggle, useTrackingEvents } from '@/hooks';
import { PrototypeContext, PrototypeProvider } from '@/pages/Prototype/context';
import { getPrototypeSessionID } from '@/utils/prototype';

import { Prototype } from './components';
import PasswordScreen from './components/PasswordScreen';

const PublicPrototype: React.FC<RouteComponentProps<{ versionID: string }>> = ({ match }) => {
  const setupPublicPrototype = useDispatch(PrototypeDuck.setupPublicPrototype);
  const checkSharedProtoPassword = useDispatch(PrototypeDuck.checkSharedProtoPassword);
  const prototypeID = useSelector(PrototypeDuck.prototypeIDSelector);
  const [isLoaded, toggleLoaded] = useToggle(false);
  const [settings, setSettings] = React.useState<PrototypeDuck.PrototypeSettings & { globalMessageDelayMilliseconds?: number }>({
    plan: PlanType.STARTER,
    layout: PrototypeDuck.PrototypeLayout.TEXT_DIALOG,
    buttons: BaseButton.ButtonsLayout.STACKED,
    locales: [],
    platform: VoiceflowConstants.PlatformType.GENERAL,
    hasPassword: false,
    projectName: '',
    globalMessageDelayMilliseconds: 0,
  });

  const prototypeAPI = React.useContext(PrototypeContext);

  const { config, state, actions } = prototypeAPI;

  const { updatePrototype } = actions;

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

  const onInteract = React.useCallback(() => {
    const { versionID } = match.params;

    trackingEvents.trackPublicPrototypeInteract({
      device: DEVICE_INFO.platform ?? 'unknown',
      sessionID: getPrototypeSessionID(versionID, prototypeID),
      versionID,
    });
  }, [match.params, prototypeID]);

  return isLoaded ? (
    <>
      <RemoveIntercom />
      <SeoHelmet page={SeoPage.PROTOTYPE} />
      {isAuthenticated || !canUseSharedPassword ? (
        <Prototype
          settings={settings}
          onInteract={onInteract}
          config={config}
          state={state}
          actions={actions}
          globalDelayInMilliseconds={settings.globalMessageDelayMilliseconds || 0}
        />
      ) : (
        <PasswordScreen settings={settings} checkLogin={checkLogin} />
      )}
    </>
  ) : (
    <FullSpinner name="Prototype" />
  );
};

export default withProvider(PrototypeProvider)(PublicPrototype);
