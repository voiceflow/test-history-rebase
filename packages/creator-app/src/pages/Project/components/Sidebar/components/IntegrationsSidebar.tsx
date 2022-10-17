import { Utils } from '@voiceflow/realtime-sdk';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';
import { generatePath } from 'react-router-dom';

import NavLinkSidebar, { NavLinkItem, NavLinkSection } from '@/components/NavLinkSidebar';
import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useAlexaProjectSettings, useFeature, usePermission, useSelector } from '@/hooks';

import { SideBarComponentProps } from '../types';
import CanvasIconMenu from './CanvasIconMenu';
import IconMenuOffsetContainer from './IconMenuOffsetContainer';

const getDialogflowItems = (versionID: string) => [
  {
    to: generatePath(Path.PUBLISH_DIALOGFLOW, { versionID }),
    key: 'dialogflow',
    label: 'Dialogflow',
  },
];

const getPlatformItems = Utils.platform.createPlatformAndProjectTypeSelector<(versionID: string) => NavLinkItem[]>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: (versionID) => [
      { to: generatePath(Path.PUBLISH_ALEXA, { versionID }), key: 'alexa', label: 'Amazon Alexa' },
    ],
    [VoiceflowConstants.PlatformType.GOOGLE]: (versionID) => [
      { to: generatePath(Path.PUBLISH_GOOGLE, { versionID }), key: 'google', label: 'Google Assistant' },
    ],
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: (versionID) => getDialogflowItems(versionID),
    [VoiceflowConstants.ProjectType.CHAT]: (versionID) => [
      { to: generatePath(Path.PUBLISH_WEBCHAT, { versionID }), key: 'webchat', label: 'Web Chat' },
    ],
  },
  () => []
);

const IntegrationsSidebar: React.FC<SideBarComponentProps> = () => {
  const { platform, type } = useSelector(ProjectV2.active.metaSelector);
  const versionID = useSelector(Session.activeVersionIDSelector)!;

  const [canExportCode] = usePermission(Permission.CODE_EXPORT);

  const disableCodeExports = useFeature(Realtime.FeatureFlag.DISABLE_CODE_EXPORTS).isEnabled;
  const webchat = useFeature(Realtime.FeatureFlag.WEBCHAT).isEnabled;

  const canUseAlexaSettings = useAlexaProjectSettings();

  const items = React.useMemo<NavLinkSection[]>(() => {
    const _platformItems = canUseAlexaSettings ? getPlatformItems(platform, type)(versionID) : [];

    const platformItems = webchat ? _platformItems : _platformItems.filter(({ key }) => key !== 'webchat');

    return [
      ...(platformItems.length
        ? [
            {
              label: 'Channel',
              key: 'channel',
              items: platformItems,
            },
          ]
        : []),
      {
        label: 'Developer',
        key: 'developer',
        items: [
          { to: generatePath(Path.PUBLISH_API, { versionID }), key: 'api', label: 'API' },
          ...(!disableCodeExports && canExportCode
            ? [{ to: generatePath(Path.PUBLISH_EXPORT, { versionID }), key: 'code-export', label: 'Code Export' }]
            : []),
        ],
      },
    ];
  }, [platform, versionID, canExportCode]);

  return (
    <IconMenuOffsetContainer>
      <CanvasIconMenu />

      <NavLinkSidebar items={items} />
    </IconMenuOffsetContainer>
  );
};

export default IntegrationsSidebar;
