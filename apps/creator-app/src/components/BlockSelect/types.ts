import { BaseDiagramSelectOption, DiagramSelectGroup } from '@/hooks';

export interface Value {
  stepID: string;
  diagramID: string;
}

export interface Option extends BaseDiagramSelectOption {
  stepID: string;
}

export type Group = DiagramSelectGroup<Option>;
