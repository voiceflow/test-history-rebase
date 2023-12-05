import { BaseModels } from '@voiceflow/base-types';
import React from 'react';

import { KnowledgeBaseTableItem } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';

import { DocxDocumentName } from './components/DocxDocumentName.component';
import { PdfDocumentName } from './components/PdfDocumentName.component';
import { TextDocumentName } from './components/TextDocumentName.component';
import { UrlDocumentName } from './components/UrlDocumentName.component';

const CellComponents: Record<BaseModels.Project.KnowledgeBaseDocumentType, (item: KnowledgeBaseTableItem) => React.ReactElement> = {
  [BaseModels.Project.KnowledgeBaseDocumentType.URL]: (item) => <UrlDocumentName data={item.data as BaseModels.Project.KnowledgeBaseURL} />,
  [BaseModels.Project.KnowledgeBaseDocumentType.DOCX]: (item) => (
    <DocxDocumentName data={item.data as BaseModels.Project.KnowledgeBaseDocx} documentID={item.documentID} />
  ),
  [BaseModels.Project.KnowledgeBaseDocumentType.TEXT]: (item) => (
    <TextDocumentName data={item.data as BaseModels.Project.KnowledgeBaseText} documentID={item.documentID} />
  ),
  [BaseModels.Project.KnowledgeBaseDocumentType.PDF]: (item) => (
    <PdfDocumentName data={item.data as BaseModels.Project.KnowledgeBasePDF} documentID={item.documentID} />
  ),
};

export const DocumentNameCell: React.FC<{ item: KnowledgeBaseTableItem }> = ({ item }) => {
  return CellComponents[item.data.type](item);
};
