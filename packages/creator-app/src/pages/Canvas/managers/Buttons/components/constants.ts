export enum ButtonAction {
  FOLLOW_PATH = 'FOLLOW_PATH',
  GO_TO_INTENT = 'GO_TO_INTENT',
}

export const BUTTON_ACTION_OPTIONS = [
  { id: ButtonAction.FOLLOW_PATH, label: 'Follow Path' },
  { id: ButtonAction.GO_TO_INTENT, label: 'Go to Intent' },
];
