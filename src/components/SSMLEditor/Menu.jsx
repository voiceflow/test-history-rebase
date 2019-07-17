import SvgIcon from 'components/SvgIcon';
import React, { useState } from 'react';
import styled from 'styled-components';
import CaretDown from 'svgs/toggle.svg';

import SubMenu from './SubMenu';
import DATA from './data';

export const MenuContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Effect = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 240px;
  padding: 10px 0 10px 20px;

  &:hover {
    background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%);
  }
`;

export const SubMenuContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  display: none;
  width: 240px;
  margin: 0;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 8px 16px rgba(17, 49, 96, 0.16), 0 0 0 rgba(17, 49, 96, 0.06);
  cursor: pointer;

  & & {
    top: 0;
    transform: translateX(-100%);
  }

  ${MenuContainer}:hover > & {
    display: block;
  }

  ${Effect}:hover > & {
    display: block;
  }
`;

export const RightArrow = styled(SvgIcon)`
  margin-right: 15px;

  ${Effect}:hover > & {
    transform: translateX(50%);
    transition: all 0.1s;
  }
`;

export const PromptContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: none;
  padding: 10px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 8px 16px rgba(17, 49, 96, 0.16), 0 0 0 rgba(17, 49, 96, 0.06);
  transform: translateX(-100%);

  ${Effect}:hover > & {
    display: flex;
    flex-direction: column;
  }
`;

const AddEffectText = styled.div`
  color: ${(props) => (props.hover ? '#5d9df5' : '#62778c')};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
`;

const CaretDownIcon = styled(SvgIcon)`
  margin-left: 10px;
  margin-top: 5px;
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
      <CaretDownIcon hover={hover} icon={CaretDown} height={10} width={10} />
      <SubMenuContainer>
        {DATA.map((val, i) => (
          <SubMenu key={i} options={val} data={{ VF_path: [] }} onClick={onClick} />
        ))}
      </SubMenuContainer>
    </MenuContainer>
  );
}

export default Menu;
