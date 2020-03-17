export const CONTENT_HEIGHT = 660;

export enum TabType {
  SLOTS = 'slots',
  INTENTS = 'intents',
  VARIABLES = 'variables',
}

export const TABS = [
  {
    value: TabType.INTENTS as string,
    label: 'Intents',
  },
  {
    value: TabType.SLOTS as string,
    label: 'Slots',
  },
  {
    value: TabType.VARIABLES as string,
    label: 'Variables',
  },
];
