import { FolderScope } from '@voiceflow/dtos';
import { match } from 'ts-pattern';

export const transformCMSResourceName = (name: string): string => name.slice(0, 255);

export const getFolderScopeLabel = (name: string) =>
  match(name)
    .with(FolderScope.FLOW, () => 'component')
    .otherwise(() => name);
