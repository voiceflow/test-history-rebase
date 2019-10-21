import React from 'react';

import Icon, { SvgIconContainer } from '@/components/SvgIcon';
import { styled, units } from '@/hocs';

const ModalHeaderContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: ${units(3)}px ${units(4)}px !important;
  padding-left: 2rem;
  border: 0;

  /* adding important caused the padding to work */

  & > h5 {
    color: #8c94a6;
    font-weight: 600;
    font-size: 15px;
    text-transform: uppercase;
    margin-bottom: 0px;
  }

  & > ${SvgIconContainer} {
    padding: 10px;
    margin: -10px;
    cursor: pointer;
    color: #8da2b570;
    transition: color 150ms;

    &:hover {
      color: #8da2b5;
    }
  }
`;

const ModalHeader = ({ header, toggle, children, className }) => (
  <ModalHeaderContainer className={className}>
    {children || <h5>{header}</h5>}
    <Icon icon="close" onClick={toggle} size={12} />
  </ModalHeaderContainer>
);

export default ModalHeader;
