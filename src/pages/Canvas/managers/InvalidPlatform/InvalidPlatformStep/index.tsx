import React from 'react';
import { useSelector } from 'react-redux';

import * as Skill from '@/ducks/skill';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';

import { CHANNEL_LABELS } from '../constants';

const InvalidPlatformStep = () => {
  const platform = useSelector(Skill.activePlatformSelector);

  return (
    <Step>
      <Section>
        <Item icon="error" iconColor="#E91E63" placeholder={`Not supported on ${CHANNEL_LABELS[platform]}`} />
      </Section>
    </Step>
  );
};

export default InvalidPlatformStep;
