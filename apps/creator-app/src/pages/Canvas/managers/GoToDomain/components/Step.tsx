import * as Realtime from '@voiceflow/realtime-sdk';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import Step, { Attachment, Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../constants';
import { useGoToDomain } from './hooks';

const GoToDomainStep: ConnectedStep<Realtime.NodeData.GoToDomain> = ({ data, palette }) => {
  const goToDomainDiagram = useDispatch(Router.goToDomainDiagram);

  const goToDomain = useGoToDomain(data.domainID ?? null);

  return (
    <Step nodeID={data.nodeID}>
      <Section>
        <Item
          icon={NODE_CONFIG.icon}
          label={goToDomain && `Go to '${goToDomain.name}'`}
          palette={palette}
          attachment={
            goToDomain ? <Attachment icon="clip" onClick={stopPropagation(() => goToDomainDiagram(goToDomain.id, goToDomain.rootDiagramID))} /> : null
          }
          placeholder="Select go-to domain"
          multilineLabel
          labelLineClamp={5}
        />
      </Section>
    </Step>
  );
};

export default GoToDomainStep;
