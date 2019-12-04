import PropTypes from 'prop-types';
import React from 'react';

import Dropdown from '@/componentsV2/Dropdown';
import Menu from '@/componentsV2/Menu';
import { styled } from '@/hocs';

const PopupContainer = styled.div`
  z-index: 2;
  margin: 10px;
  background: #ffffff;
  border-radius: 5px;
  padding: 10px;
  text-transform: none;
`;

function InfoPopUp({ placement = 'bottom-start', children, reference }) {
  return (
    <Dropdown
      menu={
        <Menu>
          <PopupContainer>{children}</PopupContainer>
        </Menu>
      }
      placement={placement}
      noScroll={true}
    >
      {(ref, onToggle, isOpen) => {
        return (
          <span onClick={onToggle} ref={ref}>
            {reference(isOpen)}
          </span>
        );
      }}
    </Dropdown>
  );
}

InfoPopUp.propTypes = {
  portal: PropTypes.bool,
  label: PropTypes.any,
  placement: PropTypes.string,
  reference: PropTypes.any,
};

export default InfoPopUp;
