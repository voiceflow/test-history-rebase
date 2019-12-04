import React from 'react';

import InfoPopUp from '@/components/InfoPopup';
import Icon, { SvgIconContainer } from '@/components/SvgIcon';
import { styled, transition, units } from '@/hocs';

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
    ${transition()}
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

const IconContainer = styled.div`
  position: relative;
  cursor: pointer;
  display: inline-block;
  margin-left: 6px;
  color: #d4d9e6;
  top: 2px;
  :hover {
    color: #8c94a6;
  }

  ${({ isOpen }) =>
    isOpen &&
    `
    color: #5d9df5;
  `}
`;

const MessageContainer = styled.span`
  font-size: 15px;
  line-height: 22px;
  color: #132144;
  font-weight: 100;

  b {
    font-weight: 600;
  }

  h5 {
    font-weight: 600;
    font-size: 15px;
  }
`;

const ModalHeader = ({ header, toggle, children, className, tooltip }) => {
  return (
    <ModalHeaderContainer className={className}>
      {children || (
        <h5>
          {header}
          {tooltip && (
            <InfoPopUp
              portal={false}
              placement="bottom-start"
              reference={(isOpen) => (
                <IconContainer isOpen={isOpen}>
                  <Icon size={15} icon="info" />
                </IconContainer>
              )}
            >
              <MessageContainer>{tooltip}</MessageContainer>
            </InfoPopUp>
          )}
        </h5>
      )}
      <Icon icon="close" onClick={toggle} size={12} />
    </ModalHeaderContainer>
  );
};
export default ModalHeader;
