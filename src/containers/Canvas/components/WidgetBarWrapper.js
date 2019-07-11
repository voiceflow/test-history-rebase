import styled, { css } from 'styled-components';

import { SvgIconContainer } from '../../../components/SvgIcon';

const WidgetBarWrapper = styled.div`
  position: absolute;
  bottom: 13px;
  z-index: 5;
  display: flex;
  transition: transform 0.3s, -webkit-transform 0.3s;

  ${({ isCanvas }) =>
    isCanvas
      ? css`
          transform: translateX(290px);
        `
      : ''}
  ${({ isTest }) =>
    isTest
      ? css`
          transform: translateX(41px);
        `
      : ''};
  ${({ menuOpen }) =>
    !menuOpen
      ? css`
          transform: translateX(17px);
        `
      : ''}

  /* smooth the scrolling on touch devices - webkit browsers */
  -webkit-overflow-scrolling: touch;

  .open {
    -webkit-transform: translateX(0);
    -moz-transform: translateX(0);
    -ms-transform: translateX(0);
    -o-transform: translateX(0);
    transform: translateX(0);
  }

  .canvas-controls__action {
    pointer-events: all;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    min-width: 0;
  }

  .home-icon {
    margin-top: 2px;
  }

  .star-icon {
    margin-top: 4px;
  }

  .canvas-controls__action.__type-dual {
    background-color: #fff;
    box-shadow: 0px 1px 4px rgba(17, 49, 96, 0.16), 0px 0px 0px rgba(17, 49, 96, 0.04);
    border-radius: 42px;
    display: -ms-flexbox;
    display: flex;
    min-width: 0;
    -ms-flex-direction: row;
    flex-direction: row;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      z-index: 10;
      width: 1px;
      height: 18px;
      left: 35px;
      right: 8px;
      top: 8px;
      background-color: #dfe3ed;
    }
    .zoom-btn {
      flex: 0 0 auto;
      min-width: 0;
      -webkit-box-shadow: none;
      box-shadow: none;
      width: 34px;
      height: 34px;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        transform: none;
      }
      img {
        margin-top: -6px;
      }
      &:active {
        border: 1px solid rgba(93, 157, 245, 0.59);
        background: linear-gradient(180deg, rgba(93, 157, 245, 0.12) 0%, rgba(44, 133, 255, 0.16) 100%), #ffffff;
        box-shadow: inset 0 0 0 1px #fff;

        ${SvgIconContainer} {
          color: #5d9df5;
        }
      }
    }
  }

  .round-left {
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 30px 0 0 30px;
    img {
      margin-left: 2px;
    }
  }

  .round-right {
    border-radius: 0 30px 30px 0;
    margin-left: 3px;
    img {
      margin-left: -1px;
    }
  }

  .__type-single {
    margin-left: 13px;
    height: 34px;
    width: 34px;
    box-shadow: 0px 2px 4px rgba(17, 49, 96, 0.16), 0px 0px 0px rgba(17, 49, 96, 0.04);
    .home {
      margin-top: -3px;
    }
    .star {
      margin-top: -1px;
    }
    &:hover {
      transform: none;
      box-shadow: 0px 2px 4px rgba(17, 49, 96, 0.210739), 0px 0px 0px rgba(17, 49, 96, 0.04);
    }
    &:active {
      border: 1px solid rgba(93, 157, 245, 0.59);
      background: linear-gradient(180deg, rgba(93, 157, 245, 0.12) 0%, rgba(44, 133, 255, 0.16) 100%), #ffffff;
      box-shadow: inset 0 0 0 1px #fff;

      ${SvgIconContainer} {
        color: #5d9df5;
      }
    }
  }
`;

export default WidgetBarWrapper;
