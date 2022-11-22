import React from 'react';

import { UnclassifiedTabIcons, UnclassifiedTabs } from '@/pages/NLUManager/constants';

import { ClusteringTabTooltip } from './components';

const UnclassifiedItemsTooltips: Record<UnclassifiedTabs, React.ReactNode> = {
  [UnclassifiedTabs.CLUSTERING_VIEW]: <ClusteringTabTooltip />,
  [UnclassifiedTabs.UNCLASSIFIED_VIEW]: null,
};

export const UnclassifiedTabItems = Object.values(UnclassifiedTabs).map((tab) => ({
  tabID: tab,
  icon: UnclassifiedTabIcons[tab],
  tooltip: UnclassifiedItemsTooltips[tab],
}));
