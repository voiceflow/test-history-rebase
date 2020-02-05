import React from 'react';

import { IntegrationType } from '@/constants';

import Container from './IntegrationContainer';
import HelpIcon from './IntegrationHelpIcon';
import Icon from './IntegrationIcon';
import ImageContainer from './IntegrationImageContainer';
import Name from './IntegrationName';
import ZapierImg from './IntegrationZapierImg';

function Integration({ data, onClick }) {
  return (
    <Container className="d-flex flex-column align-items-center" onClick={() => onClick(data.type)}>
      <HelpIcon title={data.tooltip} position="left">
        ?
      </HelpIcon>

      <ImageContainer>
        <Icon icon={data.icon} size={70} />
        {data.type === IntegrationType.ZAPIER && <ZapierImg src="/zapier.png" alt="Zapier" height="50" />}
      </ImageContainer>

      <Name>{data.text}</Name>
    </Container>
  );
}

export default Integration;
