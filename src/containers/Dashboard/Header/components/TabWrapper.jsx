import React from 'react';
import { Link } from 'react-router-dom';

import { css, styled } from '@/hocs';
import { ANIMATION_SPEED } from '@/styles/theme';

const TabWrapper = styled(({ isActive, ...props }) => <Link {...props} />)`
  display: flex;
  height: inherit;
  padding: 14px 30px;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
  text-transform: capitalize;
  text-decoration: none;
  transition: all 0.25s ease;
  position: relative;

  color: #8da2b5;
  cursor: pointer;
  border-color: transparent;

  &:hover {
    color: #62778c;
    text-decoration: none;
  }

  ::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    overflow: hidden;
    height: 2px;
    transition: width ${ANIMATION_SPEED}s linear, opacity ${ANIMATION_SPEED}s linear;
    background-color: #5d9df5;
    opacity: 0;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      color: #5d9df5;
      cursor: default;

      ::before {
        opacity: 1;
        width: 100%;
        transition: width ${ANIMATION_SPEED}s linear;
      }

      &:hover {
        color: #5d9df5;
      }
    `}
`;

export default TabWrapper;
