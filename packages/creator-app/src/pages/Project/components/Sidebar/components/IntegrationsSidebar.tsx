import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';
import { generatePath } from 'react-router-dom';

import NavLinkSidebar, { NavLinkItem, NavLinkSection } from '@/components/NavLinkSidebar';
import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { usePermission, useSelector } from '@/hooks';

import CanvasIconMenu from './CanvasIconMenu';
import IconMenuOffsetContainer from './IconMenuOffsetContainer';

const getDialogflowItems = (versionID: string) => [
  {
    to: generatePath(Path.PUBLISH_DIALOGFLOW, { versionID }),
    key: 'dialogflow',
    label: 'Dialogflow',
  },
];

const getPlatformItems = Utils.platform.createPlatformSelectorV2<(versionID: string) => NavLinkItem[]>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: (versionID) => [
      { to: generatePath(Path.PUBLISH_ALEXA, { versionID }), key: 'alexa', label: 'Amazon Alexa' },
    ],
    [VoiceflowConstants.PlatformType.GOOGLE]: (versionID) => [
      { to: generatePath(Path.PUBLISH_GOOGLE, { versionID }), key: 'google', label: 'Google Assistant' },
    ],
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: (versionID) => getDialogflowItems(versionID),
  },
  () => []
);

const IntegrationsSidebar: React.FC = () => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const versionID = useSelector(Session.activeVersionIDSelector)!;

  const [canExportCode] = usePermission(Permission.CODE_EXPORT);

  const items = React.useMemo<NavLinkSection[]>(() => {
    const platformItems = getPlatformItems(platform)(versionID);

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
          ...(canExportCode ? [{ to: generatePath(Path.PUBLISH_EXPORT, { versionID }), key: 'code-export', label: 'Code Export' }] : []),
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
