import { DiagramEntity, ProjectEntity, ToJSON, VariableStateEntity, VersionEntity } from '@voiceflow/orm-designer';

export interface VFFile {
  project: ToJSON<ProjectEntity>;
  version: ToJSON<VersionEntity>;
  diagrams: Record<string, ToJSON<DiagramEntity>>;
  _version?: number;
  variableStates?: ToJSON<VariableStateEntity>[];
}
