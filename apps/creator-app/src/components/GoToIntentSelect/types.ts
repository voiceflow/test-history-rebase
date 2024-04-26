import type { BaseDiagramSelectOption, DiagramSelectGroup, DomainDiagramSelectMultilevel } from '@/hooks';

export interface Value {
  intentID: string;
  diagramID: string | null;
}

export interface Option extends BaseDiagramSelectOption {
  intentID: string;
}

export type Group = DiagramSelectGroup<Option>;
export type Multilevel = DomainDiagramSelectMultilevel<Option>;
