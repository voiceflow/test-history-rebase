import { TippyTooltipProps } from '@voiceflow/ui';

import { Permission } from '@/config/permissions';

export enum Tab {
  STEPS = 'blocks',
  FLOWS = 'flows',
  LAYERS = 'layers',
}

export interface TabItem {
  label: string;
  value: Tab;
  tooltip: TippyTooltipProps;
  permissions?: Permission[];
}

export const TABS: TabItem[] = [
  { value: Tab.STEPS, label: 'STEPS', tooltip: { title: 'Steps', hotkey: '<', position: 'top', distance: 8 }, permissions: [Permission.EDIT_CANVAS] },
  { value: Tab.FLOWS, label: 'FLOWS', tooltip: { title: 'Flows', hotkey: '>', position: 'top', distance: 8 } },
];

export const TOPICS_TABS: TabItem[] = [
  { value: Tab.LAYERS, label: 'LAYERS', tooltip: { title: 'Layers', hotkey: '<', position: 'top', distance: 8 } },
  { value: Tab.STEPS, label: 'STEPS', tooltip: { title: 'Steps', hotkey: '>', position: 'top', distance: 8 }, permissions: [Permission.EDIT_CANVAS] },
];
