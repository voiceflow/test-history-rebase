import { FolderScope } from '@voiceflow/dtos';
import { match } from 'ts-pattern';

export const transformCMSResourceName = (name: string): string => name.slice(0, 255);

export const getFolderScopeLabel = (name: string) =>
  match(name)
    .with(FolderScope.FLOW, () => 'component')
    .otherwise(() => name);

export const sortCreatableCMSResources = <T extends { id: string; createdAt: string }>(array: T[]) =>
  [...array].sort(
    (l, r) => new Date(r.createdAt).getTime() - new Date(l.createdAt).getTime() || r.id.localeCompare(l.id)
  );
