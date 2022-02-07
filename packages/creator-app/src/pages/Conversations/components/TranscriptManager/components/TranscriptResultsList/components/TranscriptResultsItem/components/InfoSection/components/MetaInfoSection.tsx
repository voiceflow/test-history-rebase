import { Box } from '@voiceflow/ui';
import React from 'react';

import * as ReportTag from '@/ducks/reportTag';
import { useSelector } from '@/hooks';
import { ALL_BUILTIN_TAGS_ARRAY, Sentiment, SystemTag } from '@/models';

export interface MetaInfoSection {
  isRead: boolean;
  tags: string[];
}

const MetaInfoSection: React.FC<MetaInfoSection> = ({ isRead, tags }) => {
  const tagLabels = useSelector(ReportTag.reportTagsByIDsSelector)(tags).map((reportTag) => reportTag.label);
  const hasCustomTags = tags.some((tag) => !ALL_BUILTIN_TAGS_ARRAY.includes(tag as SystemTag | Sentiment));

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
