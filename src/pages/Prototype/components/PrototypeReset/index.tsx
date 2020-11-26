import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import { FlexCenter } from '@/components/Flex';
import { styled } from '@/hocs';
import { Identifier } from '@/styles/constants';

export type PrototypeResetProps = {
  onClick: React.MouseEventHandler<HTMLSpanElement>;
};

const Container = styled(FlexCenter)`
  height: 179px;
  border-top: solid 1px #eaeff4;
`;

const PrototypeReset: React.FC<PrototypeResetProps> = ({ onClick }) => (
  <Container>
    <Button variant={ButtonVariant.TERTIARY} id={Identifier.PROTOTYPE_RESET} onClick={onClick}>
      Reset Test
    </Button>
  </Container>
);

export default PrototypeReset;
