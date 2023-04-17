import { SvgIconTypes } from '@voiceflow/ui';
import React from 'react';

import ClusteringTabTooltip from '@/pages/NLUManager/components/ClusteringTabTooltip';

export const EDITOR_LEFT_SIDEBAR_WIDTH = 450;
export const MENU_RIGHT_SIDEBAR_WIDTH = 61;

export enum EditorTabs {
  INTENT_CONFLICTS = 'intent-conflicts',
}

export enum UnclassifiedTabs {
  UNCLASSIFIED_VIEW = 'UNCLASSIFIED_VIEW',
  CLUSTERING_VIEW = 'CLUSTERING_VIEW',
}

export const UnclassifiedTabIcons: Record<UnclassifiedTabs, SvgIconTypes.Icon> = {
  [UnclassifiedTabs.UNCLASSIFIED_VIEW]: 'list',
  [UnclassifiedTabs.CLUSTERING_VIEW]: 'cluster',
};

export const UnclassifiedItemsTooltips: Record<UnclassifiedTabs, React.ReactNode> = {
  [UnclassifiedTabs.CLUSTERING_VIEW]: <ClusteringTabTooltip />,
  [UnclassifiedTabs.UNCLASSIFIED_VIEW]: null,
};

export const UnclassifiedTabItems = Object.values(UnclassifiedTabs).map((tab) => ({
  tabID: tab,
  icon: UnclassifiedTabIcons[tab],
  tooltip: UnclassifiedItemsTooltips[tab],
}));
