import { BaseDiagramSelectOption, DiagramSelectGroup, DomainDiagramSelectMultilevel } from '@/hooks';

export interface Value {
  intentID: string;
  diagramID: string | null;
}

export interface Option extends BaseDiagramSelectOption {
  intentID: string;
}

export type Group = DiagramSelectGroup<Option>;
export type Multilevel = DomainDiagramSelectMultilevel<Option>;

export interface BaseProps {
  onChange: (value: Value | null) => void;
  placeholder?: string;
  clearOnSelectActive?: boolean;
}

export interface Props extends BaseProps {
  value: Value | null;
}

export interface ChildProps extends BaseProps {
  value: string | null;
}
