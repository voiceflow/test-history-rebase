import { MenuItemMultilevel, MenuItemWithID } from '@voiceflow/ui';

import { BaseDiagramSelectOption, DiagramSelectGroup, DomainDiagramSelectMultilevel } from '@/hooks';

export interface Value {
  stepID: string;
  diagramID: string;
}

export interface Option extends BaseDiagramSelectOption {
  nodeID: string;
}

export type Group = DiagramSelectGroup<Option>;
export type Multilevel = DomainDiagramSelectMultilevel<Option>;

export interface BlockOption extends MenuItemWithID {
  label: string;
  nodeID: string;
  diagramID: string;
}

export interface GroupOption extends MenuItemMultilevel<BlockOption | GroupOption> {
  id: string;
  label: string;
}
