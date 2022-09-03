import { BaseSelectProps } from '@voiceflow/ui';

import { BaseDiagramSelectOption, DiagramSelectGroup, DomainDiagramSelectMultilevel } from '@/hooks';

export interface Value {
  stepID: string;
  diagramID: string;
}

export interface Option extends BaseDiagramSelectOption {
  stepID: string;
}

export type Group = DiagramSelectGroup<Option>;
export type Multilevel = DomainDiagramSelectMultilevel<Option>;

export interface BaseProps extends BaseSelectProps {
  onChange: (value: Value | null) => void;
  clearable?: boolean;
}

export interface Props extends BaseProps {
  value: Value | null;
  startNodeIsDefault?: boolean;
}

export interface ChildProps extends BaseProps {
  value: string | null;
  clearable: boolean;
}
