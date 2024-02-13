import React from 'react';

import { transformCMSResourceName } from '@/utils/cms.util';

import type { ICMSTableNameCell } from './CMSTableNameCell.interface';
import { CMSTableNameCellFolder } from './CMSTableNameCellFolder.component copy';
import { CMSTableNameCellResource } from './CMSTableNameCellResource.component copy';

export const CMSTableNameCell = <ColumnType extends string>({
  isFolder,
  nameTransform = transformCMSResourceName,
  ...props
}: ICMSTableNameCell<ColumnType>) =>
  isFolder ? (
    <CMSTableNameCellFolder {...props} nameTransform={nameTransform} />
  ) : (
    <CMSTableNameCellResource {...props} nameTransform={nameTransform} />
  );
