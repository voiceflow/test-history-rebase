import { Box, Table } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React from 'react';

import { MediaLibraryAttachmentPreview } from '@/components/MediaLibrary/MediaLibraryAttachmentPreview/MediaLibraryAttachmentPreview.component';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

import { cmsResponseGetVariantAttachmentOrderByResponseIDAtom } from '../../../CMSResponse.atom';
import type { ICMSResponseTableAttachmentCell } from './CMSResponseTableAttachmentCell.interface';

export const CMSResponseTableAttachmentCell: React.FC<ICMSResponseTableAttachmentCell> = ({ response }) => {
  const variantAttachmentOrder = useAtomValue(cmsResponseGetVariantAttachmentOrderByResponseIDAtom)({
    responseID: response.id,
  });
  const attachments = useSelector(Designer.selectors.allResponseAttachmentWithAttachmentByIDs, {
    ids: variantAttachmentOrder,
  });

  if (!attachments.length) return <Table.Cell.Empty />;

  return (
    <Box gap={8} height="32px" alignSelf="center" overflow="hidden" wrap="wrap">
      {attachments.map(({ id, attachment }) => (
        <MediaLibraryAttachmentPreview key={id} attachment={attachment} />
      ))}
    </Box>
  );
};
