import styled, { css } from 'styled-components';

const WidgetBarWrapper = styled.div`
  position: absolute;
  bottom: 13px;
  z-index: 5;
  display: flex;
  transition: transform 0.3s, -webkit-transform 0.3s;

  left: 50%;
  margin-left: -50px;

  ${({ isCanvas }) =>
    isCanvas
      ? css`
          transform: translateX(-334px);
        `
      : ''}
  ${({ isTest }) =>
    isTest
      ? css`
          transform: translateX(-334px);
        `
      : ''};
  ${({ menuOpen }) =>
    !menuOpen
      ? css`
          transform: translateX(-604px);
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

  .canvas-controls__action.__type-dual {
    background-color: #fff;
    box-shadow: -1px 0px 4px rgba(17, 49, 96, 0.16), 0px 0px 0px rgba(17, 49, 96, 0.04);
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
      margin-left: 0;
      -webkit-box-shadow: none;
      box-shadow: none;
      width: 34px;
      height: 34px;
      padding: 8px;
      &:hover {
        transform: none;
      }
      img {
        margin-top: -6px;
        margin-left: 1px;
      }
    }
  }

  .round-left {
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 30px 0 0 30px;
  }

  .round-right {
    border-radius: 0 30px 30px 0;
    margin-left: 1px;
    img {
      margin-left: -1px;
    }
  }

  .__type-single {
    margin-left: 13px;
    height: 34px;
    width: 34px;
    box-shadow: 0px 2px 4px rgba(17, 49, 96, 0.16), 0px 0px 0px rgba(17, 49, 96, 0.04);
    img {
      height: 15px;
      width: 15px;
    }
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
  }
`;

export default WidgetBarWrapper;
