import { css, styled } from '@/styles';

import { Size } from './constants';

const sizeStyles = {
  [Size.SMALL]: css`
    position: relative;
    height: 20px;

    .react-toggle-track {
      width: 39px;
      height: 19px;
    }

    .react-toggle-thumb {
      width: 13px;
      height: 13px;
    }

    .react-toggle--checked .react-toggle-thumb {
      left: 23px;
    }
  `,

  [Size.EXTRA_SMALL]: css`
    .react-toggle-track {
      width: 32px;
      height: 16px;
    }

    .react-toggle-thumb {
      width: 13px;
      height: 13px;
      top: 2px;
      left: 2px;
      transform: translate(-0.5px, -0.5px);
    }

    .react-toggle--checked .react-toggle-thumb {
      left: 18px;
    }
  `,
};

export const Label = styled.div`
  width: 24px;
  color: #132144;
  font-weight: 400;
  margin-right: 12px;
`;

export const Content = styled.div<{ size: Size }>`
  display: flex;

  .react-toggle {
    position: relative;
    display: inline-block;
    padding: 0;
    background-color: transparent;
    border: 0;
    cursor: pointer;
    user-select: none;
    touch-action: pan-x;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: transparent;
  }

  .react-toggle-screenreader-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    border: 0;
    clip: rect(0 0 0 0);
  }

  .react-toggle--disabled {
    cursor: not-allowed;
    opacity: 0.4;
    transition: opacity 0.25s;
  }

  .react-toggle-track {
    width: 49px;
    height: 24px;
    padding: 0;
    background: #cad7e3;
    border-radius: 30px;
    transition: all 0.2s ease;
  }

  .react-toggle--checked .react-toggle-track {
    background: #3d82e2;
  }

  .react-toggle--checked:hover:not(.react-toggle--disabled) .react-toggle-track {
    background: #3d82e2;
  }

  .react-toggle-track-check {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 8px;
    width: 14px;
    height: 10px;
    margin-top: auto;
    margin-bottom: auto;
    line-height: 0;
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  .react-toggle--checked .react-toggle-track-check {
    opacity: 1;
    transition: opacity 0.25s ease;
  }

  .react-toggle-track-x {
    position: absolute;
    top: 0;
    right: 10px;
    bottom: 0;
    width: 10px;
    height: 10px;
    margin-top: auto;
    margin-bottom: auto;
    line-height: 0;
    opacity: 1;
    transition: opacity 0.25s ease;
  }

  .react-toggle--checked .react-toggle-track-x {
    opacity: 0;
  }

  .react-toggle-thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    background-color: #fff;

    /* border: 1px solid #4D4D4D; */
    border: 0.5px #1131601a;
    border-radius: 50%;
    box-shadow: 0 2px 4px 0 #1131601f;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    transition: all 0.25s ease;
  }

  .react-toggle--checked .react-toggle-thumb {
    left: 27px;
    border-color: #19ab27;
  }

  ${({ size }) => size !== Size.NORMAL && sizeStyles[size]}
`;

export const Container = styled.label<{ hasLabel: boolean }>`
  margin-bottom: 0;

  ${({ hasLabel }) =>
    hasLabel &&
    css`
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      border: 1px solid #dfe3ed;
      height: 42px;
      padding: 0 16px;
      cursor: pointer;
    `};
`;
