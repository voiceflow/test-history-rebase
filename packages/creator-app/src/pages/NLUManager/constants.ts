import { SvgIconTypes } from '@voiceflow/ui';

export const EDITOR_LEFT_SIDEBAR_WIDTH = 450;
export const MENU_RIGHT_SIDEBAR_WIDTH = 61;

export enum EditorTabs {
  UTTERANCE_RECOMMENDATIONS = 'utterance-recommendations',
  INTENT_CONFLICTS = 'intent-conflicts',
}

export enum UnclassifiedTabs {
  LIST_ALL = 'LIST_ALL',
  CLUSTER = 'CLUSTER',
}

export const UnclassifiedTabIcons: Record<UnclassifiedTabs, SvgIconTypes.Icon> = {
  [UnclassifiedTabs.LIST_ALL]: 'list',
  [UnclassifiedTabs.CLUSTER]: 'cluster',
};

export const UnclassifiedTabItems = Object.values(UnclassifiedTabs).map((tab) => ({
  tabID: tab,
  icon: UnclassifiedTabIcons[tab],
}));
