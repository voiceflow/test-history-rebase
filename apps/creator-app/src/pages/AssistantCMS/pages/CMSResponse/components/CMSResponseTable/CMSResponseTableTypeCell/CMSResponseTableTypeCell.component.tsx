import { ResponseVariantType } from '@voiceflow/dtos';
import { Table } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React from 'react';

import { getOneResponseDiscriminatorByLanguageChannelAtomResponseID } from '@/atoms/response.atom';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks';
import { CMSTableNameCell } from '@/pages/AssistantCMS/components/CMSTableNameCell/CMSTableNameCell.component';

import type { ICMSResponseTableTypeCell } from './CMSResponseTableTypeCell.interface';

const responseTypeMap = {
  [ResponseVariantType.TEXT]: 'Text',
  [ResponseVariantType.PROMPT]: 'Prompt',
};

export const CMSResponseTableTypeCell: React.FC<ICMSResponseTableTypeCell> = ({
  responseID,
  language,
  channel,
  isFolder,
}) => {
  const triggers = useAtomValue(getOneResponseDiscriminatorByLanguageChannelAtomResponseID);
  const [variantID] = triggers({ responseID, language, channel })?.variantOrder || [];
  const variant = useSelector(Designer.Response.ResponseVariant.selectors.oneByID, { id: variantID });

  if (!variant) return <Table.Cell.Empty />;

  return (
    <CMSTableNameCell
      type={variant.type}
      name={responseTypeMap[variant.type]}
      itemID={responseID}
      isFolder={isFolder}
    />
  );
};
