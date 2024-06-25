import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import type { HoverButtonProps } from './Hover';
import Hover from './Hover';

export interface EntityButtonProps extends Omit<HoverButtonProps, 'label' | 'pluralLabel'> {
  contextEntities?: Realtime.SlotInput[];
  hasExtraContext?: boolean;
}

const EntityButton: React.FC<EntityButtonProps> = ({ disabled, contextEntities, hasExtraContext, ...props }) => {
  const entitiesAreEmpty = React.useMemo(
    () => !contextEntities || contextEntities.every((entity) => !entity.value.trim() && !entity.synonyms.trim()),
    [contextEntities]
  );

  return (
    <Hover
      {...props}
      label="value"
      disabled={disabled || (!hasExtraContext && entitiesAreEmpty)}
      quantities={[5, 10, 20]}
      pluralLabel="values"
    />
  );
};

export default EntityButton;
