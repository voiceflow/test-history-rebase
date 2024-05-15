import { BaseModels } from '@voiceflow/base-types';

export interface DBKnowledgeBaseDocumentChunk {
  chunkID: string;
  content: string;
}

export interface DBKnowledgeBaseDocument extends Omit<BaseModels.Project.KnowledgeBaseDocument, 'data' | 'updatedAt'> {
  data: BaseModels.Project.KnowledgeBaseDocument['data'] | null;
  chunks?: DBKnowledgeBaseDocumentChunk[];
  updatedAt: string;
}

export interface KnowledgeBaseDocument extends Omit<DBKnowledgeBaseDocument, 'status'> {
  id: string;
  status: BaseModels.Project.KnowledgeBaseDocumentStatus;
  folderID: string | null;
  statusData: unknown;
}

export interface DBKnowledgeBaseIntegration {
  type: BaseModels.Project.IntegrationTypes;
  state: string;
  creatorID: number;
  createdAt: string;
}

export interface KnowledgeBaseIntegration {
  id: string;
  type: BaseModels.Project.IntegrationTypes;
  state: string;
  creatorID: number;
  createdAt: string;
}

export interface ZendeskFilterBase {
  id: number;
  name: string;
}

export interface ZendeskFilterLabel extends ZendeskFilterBase {}

export interface ZendeskFilterBrand extends ZendeskFilterBase {
  subdomain: string;
}

export interface ZendeskFilterLocale extends ZendeskFilterBase {
  locale: string;
}

export interface ZendeskFilterUserSegment extends ZendeskFilterBase {
  filterID: number | null;
}

export interface ZendeskFilterCategory {
  [locale: string]: ZendeskFilterBase[];
}

export interface ZendeskBaseFilters {
  labels?: ZendeskFilterLabel[];
  locales?: ZendeskFilterLocale[];
  brands?: ZendeskFilterBrand[];
  userSegments?: ZendeskFilterUserSegment[];
}

export interface ZendeskFilters extends ZendeskBaseFilters {
  categories?: ZendeskFilterCategory;
}

export interface ZendeskCountFilters extends ZendeskBaseFilters {
  categories?: ZendeskFilterBase[];
}
