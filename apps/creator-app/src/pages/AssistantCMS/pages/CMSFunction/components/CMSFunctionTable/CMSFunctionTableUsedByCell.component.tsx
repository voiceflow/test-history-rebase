import { useAtomValue } from 'jotai';
import React from 'react';

import { functionIDResourceIDMapAtom } from '@/atoms/reference.atom';
import { CMSTableUsedByCell } from '@/pages/AssistantCMS/components/CMSTableUsedByCell/CMSTableUsedByCell.component';

interface ICMSFunctionTableUsedByCell {
  functionID: string;
}

export const CMSFunctionTableUsedByCell: React.FC<ICMSFunctionTableUsedByCell> = ({ functionID }) => {
  const functionIDResourceIDMap = useAtomValue(functionIDResourceIDMapAtom);

  return <CMSTableUsedByCell resourceID={functionID} referenceResourceIDByResourceIDMap={functionIDResourceIDMap} />;
};
