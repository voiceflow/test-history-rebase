import { useAtomValue } from 'jotai';
import React from 'react';

import { intentIDResourceIDMapAtom } from '@/atoms/reference.atom';
import { CMSTableUsedByCell } from '@/pages/AssistantCMS/components/CMSTableUsedByCell/CMSTableUsedByCell.component';

interface ICMSIntentTableUsedByCell {
  intentID: string;
}

export const CMSIntentTableUsedByCell: React.FC<ICMSIntentTableUsedByCell> = ({ intentID }) => {
  const intentIDResourceIDMap = useAtomValue(intentIDResourceIDMapAtom);

  return <CMSTableUsedByCell resourceID={intentID} referenceResourceIDByResourceIDMap={intentIDResourceIDMap} />;
};
