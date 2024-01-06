import type { Entity } from '@voiceflow/dtos';
import { Text } from '@voiceflow/ui';
import React from 'react';

import { HSLShades } from '@/constants';
import { Item } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../../constants';

export interface CaptureItemProps {
  entity?: Entity;
  label?: React.ReactNode;
  isLast: boolean;
  isFirst: boolean;
  palette: HSLShades;
  nextPortID: string;
  onOpenEditor: () => void;
}

export const CaptureItem: React.FC<CaptureItemProps> = ({ entity, label, isFirst, isLast, nextPortID = null, palette }) => {
  const icon = isFirst ? NODE_CONFIG.icon! : null;
  const portID = isLast ? nextPortID : null;

  if (!entity?.name) {
    return <Item icon={icon} portID={portID} palette={palette} wordBreak withNewLines placeholder="Select entity to capture" label={label} />;
  }

  return (
    <Item
      icon={icon}
      label={
        entity.name && (
          <>
            Capture <Text style={{ wordBreak: 'keep-all' }}>{`{${entity.name}}`}</Text>
          </>
        )
      }
      portID={portID}
      palette={palette}
      wordBreak
      withNewLines
    />
  );
};

export default CaptureItem;
