import { BaseModels } from '@voiceflow/base-types';
import { useAtomValue } from 'jotai';
import React from 'react';

import { useKnowledgeBaseCMSManager } from '../../../CMSKnowledgeBase.hook';
import type { ICMSKnowledgeBaseTableNameCell } from './CMSKnowledgeBaseTableNameCell.interface';
import { DocumentNameDocx } from './DocumentNameDocx.component';
import { DocumentNamePdf } from './DocumentNamePdf.component';
import { DocumentNameTable } from './DocumentNameTable.component';
import { DocumentNameText } from './DocumentNameText.component';
import { DocumentNameURL } from './DocumentNameURL.component';

export const CMSKnowledgeBaseTableNameCell: React.FC<ICMSKnowledgeBaseTableNameCell> = ({ item }) => {
  const cmsManager = useKnowledgeBaseCMSManager();
  const search = useAtomValue(cmsManager.search);

  switch (item.data?.type) {
    case BaseModels.Project.KnowledgeBaseDocumentType.URL:
      return <DocumentNameURL id={item.id} data={item.data} search={search} />;
    case BaseModels.Project.KnowledgeBaseDocumentType.DOCX:
      return <DocumentNameDocx id={item.id} data={item.data} search={search} />;
    case BaseModels.Project.KnowledgeBaseDocumentType.TEXT:
      return <DocumentNameText id={item.id} data={item.data} search={search} />;
    case BaseModels.Project.KnowledgeBaseDocumentType.PDF:
      return <DocumentNamePdf id={item.id} data={item.data} search={search} />;
    case BaseModels.Project.KnowledgeBaseDocumentType.TABLE:
      return <DocumentNameTable id={item.id} data={item.data} search={search} />;
    default:
      return null;
  }
};
