import React, { useState } from 'react';
import styled from 'styled-components';

import SvgIcon from '@/components/SvgIcon';
import CaretDown from '@/svgs/toggle.svg';

import MenuContainer from './MenuContainer';
import SubMenu from './SubMenu';
import SubMenuContainer from './SubMenuContainer';
import DATA from './data';

const AddEffectText = styled.div`
  color: ${(props) => (props.hover ? '#5d9df5' : '#62778c')};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
`;

const CaretDownIcon = styled(SvgIcon)`
  margin-left: 10px;
  color: ${(props) => (props.hover ? '#5d9df5' : '#62778c')};
`;

function Menu(props) {
  const { onClick } = props;
  const [hover, changeHover] = useState(false);

  const onMouseOver = () => changeHover(true);
  const onMouseLeave = () => changeHover(false);

  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <MenuContainer onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      <AddEffectText hover={hover}>ADD EFFECT</AddEffectText>
      <CaretDownIcon hover={hover} hoverColor="#5d9df5" icon={CaretDown} height={10} width={10} />
      <SubMenuContainer>
        {DATA.map((val, i) => (
          <SubMenu key={i} options={val} data={{ VF_path: [] }} onClick={onClick} />
        ))}
      </SubMenuContainer>
    </MenuContainer>
  );
}

export default Menu;
