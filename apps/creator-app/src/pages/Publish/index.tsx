import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Header, Scroll, SecondaryNavigation, TabLoader } from '@voiceflow/ui-next';
import React, { Suspense } from 'react';
import { matchPath, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { match } from 'ts-pattern';

import { AssistantLayout } from '@/components/Assistant/AssistantLayout/AssistantLayout.component';
import Page from '@/components/Page';
import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import { Project } from '@/ducks';
import { lazy } from '@/hocs/lazy';
import { useFeature } from '@/hooks/feature';
import { useOnLinkClick } from '@/hooks/navigation.hook';
import { usePermission } from '@/hooks/permission';
import { useSelector } from '@/hooks/store.hook';
import { isMicrosoftTeamsPlatform, isSMSPlatform, isWebChatPlatform, isWhatsAppPlatform } from '@/utils/typeGuards';

import API from './API';

const Export = lazy(() => import('./Export'));
const PublishSMS = lazy(() => import('./SMS'));
const PublishTeams = lazy(() => import('./MicrosoftTeams'));
const PrototypeSMS = lazy(() => import('./SMS/Prototype'));
const PublishWebchat = lazy(() => import('./Webchat'));
const PublishWhatsApp = lazy(() => import('./WhatsApp'));
const PrototypeWhatsApp = lazy(() => import('./WhatsApp/Prototype'));

const Publish: React.FC = () => {
  const location = useLocation();
  const onLinkClick = useOnLinkClick();

  const [canCodeExport] = usePermission(Permission.FEATURE_EXPORT_CODE);
  const [canEditAPIKey] = usePermission(Permission.API_KEY_UPDATE);
  const [canEditProject] = usePermission(Permission.PROJECT_UPDATE);

  const name = useSelector(Project.active.nameSelector);
  const hasProject = useSelector(Project.active.hasSelector);
  const { platform } = useSelector(Project.active.metaSelector);

  const disableCodeExports = useFeature(Realtime.FeatureFlag.DISABLE_CODE_EXPORTS);
  const viewerAPIKeyAccess = useFeature(Realtime.FeatureFlag.ALLOW_VIEWER_APIKEY_ACCESS);

  return (
    <AssistantLayout>
      <Box height="100%" overflow="hidden">
        <Box height="100%" style={{ flexShrink: 0 }}>
          <SecondaryNavigation title={hasProject ? name ?? '' : 'Loading...'}>
            <SecondaryNavigation.Section title="Integrations" isCollapsible={false}>
              {(canEditAPIKey || viewerAPIKeyAccess.isEnabled) && (
                <SecondaryNavigation.Item
                  icon="Api"
                  label="API Keys"
                  testID="integrations__tab--api-keys"
                  onClick={onLinkClick(Path.PUBLISH_API)}
                  isActive={!!matchPath(location.pathname, Path.PUBLISH_API)}
                />
              )}

              {canEditProject &&
                match(platform)
                  .when(isWebChatPlatform, () => (
                    <SecondaryNavigation.Item
                      icon="ChatWidgetGray"
                      label="Web Chat"
                      onClick={onLinkClick(Path.PUBLISH_WEBCHAT)}
                      isActive={!!matchPath(location.pathname, Path.PUBLISH_WEBCHAT)}
                    />
                  ))
                  .when(isSMSPlatform, () => (
                    <>
                      <SecondaryNavigation.Item
                        icon="TwilioGray"
                        label="Twilio SMS"
                        onClick={onLinkClick(Path.PUBLISH_SMS)}
                        isActive={!!matchPath(location.pathname, Path.PUBLISH_SMS)}
                      />
                      <SecondaryNavigation.Item
                        icon="TwilioGray"
                        label="Test via SMS"
                        onClick={onLinkClick(Path.PROTOTYPE_SMS)}
                        isActive={!!matchPath(location.pathname, Path.PROTOTYPE_SMS)}
                      />
                    </>
                  ))
                  .when(isWhatsAppPlatform, () => (
                    <>
                      <SecondaryNavigation.Item
                        icon="WhatsappGray"
                        label="WhatsApp Business"
                        onClick={onLinkClick(Path.PUBLISH_WHATSAPP)}
                        isActive={!!matchPath(location.pathname, Path.PUBLISH_WHATSAPP)}
                      />
                      <SecondaryNavigation.Item
                        icon="WhatsappGray"
                        label="Test on Phone"
                        onClick={onLinkClick(Path.PROTOTYPE_WHATSAPP)}
                        isActive={!!matchPath(location.pathname, Path.PROTOTYPE_WHATSAPP)}
                      />
                    </>
                  ))
                  .when(isWebChatPlatform, () => (
                    <SecondaryNavigation.Item
                      icon="MsTeamsGray"
                      label="Microsoft Teams"
                      onClick={onLinkClick(Path.PUBLISH_TEAMS)}
                      isActive={!!matchPath(location.pathname, Path.PUBLISH_TEAMS)}
                    />
                  ))
                  .otherwise(() => null)}

              {!disableCodeExports && canCodeExport && (
                <SecondaryNavigation.Item
                  icon="Export"
                  label="Code Export"
                  onClick={onLinkClick(Path.PUBLISH_EXPORT)}
                  isActive={!!matchPath(location.pathname, Path.PUBLISH_EXPORT)}
                />
              )}
            </SecondaryNavigation.Section>
          </SecondaryNavigation>
        </Box>

        <Box direction="column" width="100%">
          <Header variant="search" style={{ flexShrink: 0 }} />

          <Scroll width="100%">
            <Suspense fallback={<TabLoader variant="dark" />}>
              <Page.Content>
                <Switch>
                  {(canEditAPIKey || viewerAPIKeyAccess.isEnabled) && <Route path={Path.PUBLISH_API} component={API} />}

                  {isSMSPlatform(platform) && canEditProject && (
                    <Route path={Path.PUBLISH_SMS} component={PublishSMS} />
                  )}
                  {isSMSPlatform(platform) && canEditProject && (
                    <Route path={Path.PROTOTYPE_SMS} component={PrototypeSMS} />
                  )}
                  {isWebChatPlatform(platform) && canEditProject && (
                    <Route path={Path.PUBLISH_WEBCHAT} component={PublishWebchat} />
                  )}
                  {isWhatsAppPlatform(platform) && canEditProject && (
                    <Route path={Path.PUBLISH_WHATSAPP} component={PublishWhatsApp} />
                  )}
                  {isWhatsAppPlatform(platform) && canEditProject && (
                    <Route path={Path.PROTOTYPE_WHATSAPP} component={PrototypeWhatsApp} />
                  )}
                  {isMicrosoftTeamsPlatform(platform) && canEditProject && (
                    <Route path={Path.PUBLISH_TEAMS} component={PublishTeams} />
                  )}

                  {!disableCodeExports.isEnabled && canCodeExport && (
                    <Route path={Path.PUBLISH_EXPORT} component={Export} />
                  )}

                  <Redirect
                    to={canEditAPIKey || viewerAPIKeyAccess.isEnabled ? Path.PUBLISH_API : Path.PROJECT_VERSION}
                  />
                </Switch>
              </Page.Content>
            </Suspense>
          </Scroll>
        </Box>
      </Box>
    </AssistantLayout>
  );
};

export default Publish;
