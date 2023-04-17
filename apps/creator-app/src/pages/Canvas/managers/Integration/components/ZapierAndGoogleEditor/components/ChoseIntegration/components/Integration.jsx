import { BaseNode } from '@voiceflow/base-types';
import React from 'react';

import { zapierWordmark } from '@/assets';

import Container from './IntegrationContainer';
import HelpIcon from './IntegrationHelpIcon';
import Icon from './IntegrationIcon';
import ImageContainer from './IntegrationImageContainer';
import Name from './IntegrationName';
import ZapierImg from './IntegrationZapierImg';

const Integration = ({ data, onClick }) => (
  <Container className="d-flex flex-column align-items-center" onClick={() => onClick(data.type)}>
    <HelpIcon content={data.tooltip} position="left">
      ?
    </HelpIcon>

    <ImageContainer>
      <Icon icon={data.icon} size={70} />
      {data.type === BaseNode.Utils.IntegrationType.ZAPIER && <ZapierImg src={zapierWordmark} alt="Zapier" height="50" />}
    </ImageContainer>

    <Name>{data.text}</Name>
  </Container>
);

export default Integration;
