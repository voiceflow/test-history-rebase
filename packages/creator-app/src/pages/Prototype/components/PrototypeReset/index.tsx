import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import { FlexCenter } from '@/components/Flex';
import { styled } from '@/hocs';
import { Identifier } from '@/styles/constants';

export type PrototypeResetProps = {
  onClick: React.MouseEventHandler<HTMLSpanElement>;
  stepBack: () => void;
  goBackDisabled: boolean;
};

const Container = styled(FlexCenter)`
  height: 179px;
  border-top: solid 1px #eaeff4;
  background: white;
`;

const Splitter = styled.div`
  height: 16px;
  width: 1px;
  background: #dfe3ed;
  margin: 0 12px;
`;

const PrototypeReset: React.FC<PrototypeResetProps> = ({ onClick, stepBack, goBackDisabled }) => (
  <Container>
    <Button variant={ButtonVariant.TERTIARY} disabled={goBackDisabled} onClick={stepBack}>
      Go Back
    </Button>
    <Splitter />
    <Button variant={ButtonVariant.TERTIARY} id={Identifier.PROTOTYPE_RESET} onClick={onClick}>
      Reset Test
    </Button>
  </Container>
);

export default PrototypeReset;
