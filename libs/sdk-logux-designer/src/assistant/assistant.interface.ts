import type { ObjectResource } from '@/common';

export interface Assistant extends ObjectResource {
  name: string;
  workspaceID: string;
  activePersonaID: string | null;
}
