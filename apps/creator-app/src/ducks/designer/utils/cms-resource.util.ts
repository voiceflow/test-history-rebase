import { FolderScope } from '@voiceflow/dtos';
import { match } from 'ts-pattern';

import * as Entity from '../entity';
import * as Flow from '../flow';
import * as Function from '../function';
import * as Intent from '../intent';
import * as KnowledgeBase from '../knowledge-base';
import * as Variable from '../variable';
import * as Workflow from '../workflow';

export const getCMSResourceOneByIDSelector = (scope: FolderScope) =>
  match(scope)
    .with(FolderScope.FLOW, () => Flow.selectors.oneByID)
    .with(FolderScope.ENTITY, () => Entity.selectors.oneByID)
    .with(FolderScope.INTENT, () => Intent.selectors.oneByID)
    .with(FolderScope.WORKFLOW, () => Workflow.selectors.oneByID)
    .with(FolderScope.FUNCTION, () => Function.selectors.oneByID)
    .with(FolderScope.VARIABLE, () => Variable.selectors.oneByID)
    .with(FolderScope.KNOWLEDGE_BASE, () => KnowledgeBase.Document.selectors.oneByID)
    .otherwise(() => {
      throw new Error('Unsupported scope');
    });

export const getCMSResourceCountSelector = (scope: FolderScope) =>
  match(scope)
    .with(FolderScope.FLOW, () => Flow.selectors.count)
    .with(FolderScope.ENTITY, () => Entity.selectors.count)
    .with(FolderScope.INTENT, () => Intent.selectors.countWithoutFallback)
    .with(FolderScope.WORKFLOW, () => Workflow.selectors.count)
    .with(FolderScope.FUNCTION, () => Function.selectors.count)
    .with(FolderScope.VARIABLE, () => Variable.selectors.count)
    .with(FolderScope.KNOWLEDGE_BASE, () => KnowledgeBase.Document.selectors.count)
    .otherwise(() => {
      throw new Error('Unsupported scope');
    });

export const getCMSResourceAllByIDsSelector = (scope: FolderScope) =>
  match(scope)
    .with(FolderScope.FLOW, () => Flow.selectors.allByIDs)
    .with(FolderScope.ENTITY, () => Entity.selectors.allByIDs)
    .with(FolderScope.INTENT, () => Intent.selectors.allByIDs)
    .with(FolderScope.FUNCTION, () => Function.selectors.allByIDs)
    .with(FolderScope.WORKFLOW, () => Workflow.selectors.allByIDs)
    .with(FolderScope.VARIABLE, () => Variable.selectors.allByIDs)
    .with(FolderScope.KNOWLEDGE_BASE, () => KnowledgeBase.Document.selectors.allByIDs)
    .otherwise(() => {
      throw new Error('Unsupported scope');
    });

export const getCMSResourceAllByFolderIDsSelector = (scope: FolderScope) =>
  match(scope)
    .with(FolderScope.FLOW, () => Flow.selectors.allByFolderIDs)
    .with(FolderScope.ENTITY, () => Entity.selectors.allByFolderIDs)
    .with(FolderScope.INTENT, () => Intent.selectors.allByFolderIDs)
    .with(FolderScope.WORKFLOW, () => Workflow.selectors.allByFolderIDs)
    .with(FolderScope.FUNCTION, () => Function.selectors.allByFolderIDs)
    .with(FolderScope.VARIABLE, () => Variable.selectors.allByFolderIDs)
    .with(FolderScope.KNOWLEDGE_BASE, () => KnowledgeBase.Document.selectors.allByFolderIDs)
    .otherwise(() => {
      throw new Error('Unsupported scope');
    });
