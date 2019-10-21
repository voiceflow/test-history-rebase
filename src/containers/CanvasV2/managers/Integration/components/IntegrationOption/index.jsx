import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { IntegrationType } from '@/constants';

import HelpIcon from './components/HelpIcon';
import ImageContainer from './components/ImageContainer';
import IntegrationOptionContainer from './components/IntegrationOptionContainer';
import IntegrationsName from './components/IntegrationsName';
import ZapierImg from './components/ZapierImg';

function IntegrationOption({ data, onClick }) {
  return (
    <IntegrationOptionContainer className="d-flex flex-column align-items-center" onClick={() => onClick(data.type)}>
      <HelpIcon title={data.tooltip} position="left">
        ?
      </HelpIcon>
      <ImageContainer>
        <SvgIcon style={{ display: 'inline-block' }} icon={data.icon} size={70} />
        {data.type === IntegrationType.ZAPIER && <ZapierImg src="/zapier.png" alt="Zapier" height="50" />}
      </ImageContainer>
      <IntegrationsName>{data.text}</IntegrationsName>
    </IntegrationOptionContainer>
  );
}

export default IntegrationOption;
