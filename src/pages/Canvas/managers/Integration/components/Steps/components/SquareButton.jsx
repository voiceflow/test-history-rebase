import React from 'react';
import { Tooltip } from 'react-tippy';

import { styled } from '@/hocs';

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

const HelpIcon = styled(Tooltip)`
  position: absolute;
  right: 12px;
  top: 12px;
  font-size: 12px;
  width: 25px;
  height: 25px;
`;

function Help({ tooltip }) {
  return <HelpIcon title={tooltip}>?</HelpIcon>;
}

function SquareButton({ text, tooltip, onClick }) {
  return (
    <SquareButtonContainer onClick={onClick}>
      {text}
      {tooltip && <Help tooltip={tooltip} />}
    </SquareButtonContainer>
  );
}

export default SquareButton;
