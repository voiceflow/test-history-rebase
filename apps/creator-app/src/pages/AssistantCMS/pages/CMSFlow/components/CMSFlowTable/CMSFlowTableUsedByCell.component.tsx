import { useAtomValue } from 'jotai';
import React from 'react';

import { diagramIDResourceIDMapAtom } from '@/atoms/reference.atom';
import { CMSTableUsedByCell } from '@/pages/AssistantCMS/components/CMSTableUsedByCell/CMSTableUsedByCell.component';

interface ICMSFlowTableUsedByCell {
  diagramID: string;
}

export const CMSFlowTableUsedByCell: React.FC<ICMSFlowTableUsedByCell> = ({ diagramID }) => {
  const diagramIDResourceIDMap = useAtomValue(diagramIDResourceIDMapAtom);

  return <CMSTableUsedByCell resourceID={diagramID} referenceResourceIDByResourceIDMap={diagramIDResourceIDMap} />;
};
