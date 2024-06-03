import { MenuItemMultilevel, MenuItemWithID } from '@voiceflow/ui';

export interface Value {
  stepID: string;
  diagramID: string;
}

export interface BlockOption extends MenuItemWithID {
  label: string;
  nodeID: string;
  diagramID: string;
}

export interface GroupOption extends MenuItemMultilevel<BlockOption | GroupOption> {
  id: string;
  label: string;
}
