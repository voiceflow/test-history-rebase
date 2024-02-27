import { FolderScope } from '@voiceflow/dtos';
import { match } from 'ts-pattern';

import { CMSRoute } from '@/config/routes';

import * as Entity from '../entity';
import * as Flow from '../flow';
import * as Function from '../function';
import * as Intent from '../intent';
import * as KnowledgeBase from '../knowledge-base';
import * as Variable from '../variable';

export const getCMSResourceOneByIDSelector = (scope: FolderScope) =>
  match(scope)
    .with(FolderScope.ENTITY, () => Entity.selectors.oneByID)
    .with(FolderScope.INTENT, () => Intent.selectors.oneByID)
    .with(FolderScope.FUNCTION, () => Function.selectors.oneByID)
    .with(FolderScope.VARIABLE, () => Variable.selectors.oneByID)
    .with(FolderScope.FLOW, () => Flow.selectors.oneByID)
    .with(FolderScope.KNOWLEDGE_BASE, () => KnowledgeBase.Document.selectors.oneByID)
    .otherwise(() => {
      throw new Error('Unsupported scope');
    });

export const getCMSResourceCountSelector = (scope: FolderScope) =>
  match(scope)
    .with(FolderScope.ENTITY, () => Entity.selectors.count)
    .with(FolderScope.INTENT, () => Intent.selectors.countWithoutFallback)
    .with(FolderScope.FUNCTION, () => Function.selectors.count)
    .with(FolderScope.VARIABLE, () => Variable.selectors.count)
    .with(FolderScope.FLOW, () => Flow.selectors.count)
    .with(FolderScope.KNOWLEDGE_BASE, () => KnowledgeBase.Document.selectors.count)
    .otherwise(() => {
      throw new Error('Unsupported scope');
    });

export const getCMSResourceAllByIDsSelector = (scope: FolderScope) =>
  match(scope)
    .with(FolderScope.ENTITY, () => Entity.selectors.allByIDs)
    .with(FolderScope.INTENT, () => Intent.selectors.allByIDs)
    .with(FolderScope.FUNCTION, () => Function.selectors.allByIDs)
    .with(FolderScope.VARIABLE, () => Variable.selectors.allByIDs)
    .with(FolderScope.FLOW, () => Flow.selectors.allByIDs)
    .with(FolderScope.KNOWLEDGE_BASE, () => KnowledgeBase.Document.selectors.allByIDs)
    .otherwise(() => {
      throw new Error('Unsupported scope');
    });

export const getCMSResourceAllByFolderIDsSelector = (scope: FolderScope) =>
  match(scope)
    .with(CMSRoute.ENTITY, () => Entity.selectors.allByFolderIDs)
    .with(CMSRoute.INTENT, () => Intent.selectors.allByFolderIDs)
    .with(CMSRoute.FUNCTION, () => Function.selectors.allByFolderIDs)
    .with(CMSRoute.VARIABLE, () => Variable.selectors.allByFolderIDs)
    .with(CMSRoute.FLOW, () => Flow.selectors.allByFolderIDs)
    .with(CMSRoute.KNOWLEDGE_BASE, () => KnowledgeBase.Document.selectors.allByFolderIDs)
    .otherwise(() => {
      throw new Error('Unsupported scope');
    });
