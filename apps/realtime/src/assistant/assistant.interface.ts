import type { BaseModels } from '@voiceflow/base-types';
import type { Project, ProjectUserRole } from '@voiceflow/dtos';

export interface CreateFromTemplateData {
  nlu: { slots: BaseModels.Slot[]; intents: BaseModels.Intent[] } | null;
  modality: { type: string; platform: string };
  templateTag?: string;
  workspaceID: number;
  projectListID: string | null;
  projectLocales: string[];
  projectMembers: Array<{ role: ProjectUserRole; creatorID: number }>;
  projectOverride?: Omit<Partial<Project>, '_id'>;
}
