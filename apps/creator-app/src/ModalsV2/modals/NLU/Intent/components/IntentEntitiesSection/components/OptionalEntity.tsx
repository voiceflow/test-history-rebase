import * as Realtime from '@voiceflow/realtime-sdk';
import { Entity } from '@voiceflow/sdk-logux-designer';
import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import OptionalEntityContainer from './OptionalEntityContainer';

interface OptionalEntityProps {
  entity: Realtime.Slot | Entity;
  onClick: VoidFunction;
}

const EntityBadge: React.FC<OptionalEntityProps> = ({ entity, onClick }) => (
  <OptionalEntityContainer onClick={onClick}>
    <SvgIcon icon="plusSmall" />
    {entity.name}
  </OptionalEntityContainer>
);

export default EntityBadge;
