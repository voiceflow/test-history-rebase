import Select from '@/components/Select';
import { inputFocus, inputStyle } from '@/componentsV2/Input';
import { styled } from '@/hocs';
import { FadeDownDelay } from '@/styles/animations';

const VariableSelectControl = styled(Select)`
  &.map-box .variable-box__placeholder {
    font-size: 12px;
    white-space: nowrap;
  }

  &.variable-box {
    & .variable-box__control {
      ${inputStyle}

      padding: 0;
      display: flex;
      background-image: url('/logic.svg');
      background-color: #fff;
      background-repeat: no-repeat;
      background-position: 15px 13px;
      padding-left: 32px;
      cursor: pointer;

      &--is-focused,
      &--is-focused:hover {
        ${inputFocus}
      }
    }

    & .variable-box__placeholder {
      color: #8da2b5;
    }

    & .variable-box__indicator-separator {
      background-color: initial;
    }

    & .variable-box__dropdown-indicator {
      margin-top: 1px;
      color: transparent;
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: 11px;

      &,
      &:hover {
        color: transparent;
      }
    }

    & .variable-box__menu {
      z-index: 100;
      color: #0b1a38;
      overflow: hidden;
      text-align: left;
      border-radius: 5px;
      box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
      cursor: pointer;
    }

    & .variable-box__menu-list {
      ${FadeDownDelay}
      padding-top: 0;
      padding-bottom: 0;
    }

    & .variable-box__option {
      position: relative;
      height: 45px;
      overflow-x: hidden;
      color: #0b1a38;
      font-size: 15px;
      white-space: nowrap;
      text-align: left;
      background-color: #fff;
      background-repeat: no-repeat;
      background-position: 13px 50%;
      transition: all 0.1s ease;
      cursor: pointer;

      &--is-focused,
      &--is-selected {
        background-color: #f7f9fb;
      }
    }
  }
`;

export default VariableSelectControl;
