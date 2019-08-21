import { css } from 'styled-components';

export const selectDropdown = css`
  .select__control {
    border-width: 1px !important;
    border-color: #d4d9e6;
    box-shadow: none !important;
    height: 44px;
    padding-left: 6px;
    ${({ variant }) =>
      variant === 'borderless'
        ? css`
            border: none !important;
          `
        : css`
            border: 1px solid #d4d9e6 !important;
            box-shadow: 0px 0px 3px rgba(17, 49, 96, 0.06) !important;
          `}
    border-radius: 6px !important;
    :hover {
      border-color: #d4d9e6;
    }
  }
  .select__control--is-focused {
    border: 1px solid #5d9df5 !important;
  }
  .select__indicator-separator {
    background-color: #fff;
  }
  .select__placeholder,
  .select__menu-notice {
    color: #8da2b5;
  }
  .select__option {
    font-size: 15px;
    line-height: 18px;
    background-color: #fff;
    color: #132144;
    cursor: pointer;
  }
  .select__option:hover {
    background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #ffffff;
  }
  .select__option:active {
    background: linear-gradient(180deg, rgba(230, 238, 241, 0.85) 0%, #eaf0f2 100%), #ffffff;
  }
  .select__group-heading {
    color: #132144;
    font-size: 15px;
    line-height: 18px;
    text-transform: none;
    font-weight: 600;
  }
  .select__group .select__option {
    padding-left: 30px;
    font-weight: 100;
    font-size: 14px;
  }
`;
