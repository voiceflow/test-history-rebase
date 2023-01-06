import { TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs/styled';

const SquareButtonContainer = styled.button`
  padding: 10px;
  width: 100%;
  border: 1px solid #e2e9ec;
  border-radius: 5px;
  margin-top: 6px;
  color: #8da2b5;
  transition: all 0.2s linear;
  position: relative;

  :hover {
    color: black;
    background-color: #f7f9fb;
  }
`;

const HelpIcon = styled(TippyTooltip)`
  position: absolute;
  right: 12px;
  top: 12px;
  font-size: 12px;
  width: 25px;
  height: 25px;
`;

const Help = ({ tooltip }) => <HelpIcon content={tooltip}>?</HelpIcon>;

const SquareButton = ({ text, tooltip, onClick }) => (
  <SquareButtonContainer onClick={onClick}>
    {text}
    {tooltip && <Help tooltip={tooltip} />}
  </SquareButtonContainer>
);

export default SquareButton;
