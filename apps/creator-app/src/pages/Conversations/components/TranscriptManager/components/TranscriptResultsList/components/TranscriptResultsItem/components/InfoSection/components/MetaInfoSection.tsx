import { Box } from '@voiceflow/ui';
import React from 'react';

import * as ReportTag from '@/ducks/reportTag';
import { useSelector } from '@/hooks';
import { isBuiltInTag } from '@/utils/reportTag';

export interface MetaInfoSection {
  isRead: boolean;
  tags: string[];
}

const MetaInfoSection: React.FC<MetaInfoSection> = ({ isRead, tags }) => {
  const tagLabels = useSelector(ReportTag.reportTagsLabelsByIDsSelector, { ids: tags });

  const hasCustomTags = tags.some((tag) => !isBuiltInTag(tag));

  if (!isRead) {
    return (
      <>
        <Box display="inline" mr={6} ml={6}>
          •
        </Box>
        <span>Unread</span>
      </>
    );
  }

  if (isRead && hasCustomTags) {
    return (
      <>
        <Box display="inline" mr={6} ml={6}>
          •
        </Box>
        <span>{tagLabels}</span>
      </>
    );
  }

  return null;
};

export default MetaInfoSection;
