import { Tab as TabOption } from '@/components/Tabs';
import { Permission } from '@/config/permissions';

export enum Tab {
  STEPS = 'blocks',
  FLOWS = 'flows',
  LAYERS = 'layers',
}

export interface TabItem extends TabOption<Tab> {
  permissions?: Permission[];
}

export const TOPICS_TABS: TabItem[] = [
  {
    value: Tab.LAYERS,
    label: 'Layers',
    tooltip: { title: 'Layers', hotkey: '<', position: 'top', distance: -2 },
    capitalize: false,
  },
  {
    value: Tab.STEPS,
    label: 'Steps',
    tooltip: { title: 'Steps', hotkey: '>', position: 'top', distance: -2 },
    capitalize: false,
    permissions: [Permission.EDIT_CANVAS],
  },
];
