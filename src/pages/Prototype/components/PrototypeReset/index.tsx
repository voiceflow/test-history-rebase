import React from 'react';

import { FlexCenter } from '@/components/Flex';
import Section from '@/components/Section';
import { ClickableText } from '@/components/Text';
import { Identifier } from '@/styles/constants';

export type PrototypeResetProps = {
  onClick: React.MouseEventHandler<HTMLSpanElement>;
};

const PrototypeReset: React.FC<PrototypeResetProps> = ({ onClick }) => (
  <Section>
    <FlexCenter>
      <ClickableText id={Identifier.PROTOTYPE_RESET} onClick={onClick}>
        Reset Test
      </ClickableText>
    </FlexCenter>
  </Section>
);

export default PrototypeReset;
