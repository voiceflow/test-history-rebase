import Flex from '@/components/Flex';
import { css, styled } from '@/hocs';

const PlatformToggleContainer = styled(Flex)`
  user-select: none;
  margin: 0 22px;

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.6;
    `}

  & .switch {
    position: relative;
    width: 168px;
    height: 42px;
    border: 1px solid #dfe3ed;
    border-radius: 50px;
    background: #f9f9f9;

    & .switch-input {
      display: none;
    }
  }

  & .switch-input.checked + .switch-label {
    color: rgba(0, 0, 0, 0.65);
    font-weight: 600;
    text-shadow: 0 1px hsla(0, 0%, 100%, 0.25);
    transition: 0.15s ease-in-out;
  }

  & .switch-input.checked + .switch-label-on ~ .switch-selection {
    right: 80px;
  }

  & .switch-label {
    position: relative;
    float: left;
    width: 75px;
    margin-left: 6px;
    padding-top: 2px;
    color: hsla(0, 0%, 100%, 0.35);
    font-size: 14px !important;
    line-height: 24px;
    text-align: center;
    z-index: 2;
    cursor: pointer;

    &-on {
      padding-left: 2px;
    }

    &-off {
      padding-right: 2px;
    }
  }

  & .switch-blue .switch-selection {
    width: 50%;
    height: 34px;
    border-radius: 50px;
    margin-top: 1px;
    margin-left: 1px;
    background: #fff;
    box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 4px 0 rgba(17, 49, 96, 0.16) !important;
  }

  & .switch-selection {
    position: absolute;
    display: block;
    top: 2px;
    right: 2px;
    width: 58px;
    height: 22px;
    background: #65bd63;
    background-image: linear-gradient(180deg, #9dd993, #65bd63);
    border-radius: 3px;
    box-shadow: inset 0 1px hsla(0, 0%, 100%, 0.5), 0 0 2px rgba(0, 0, 0, 0.2);
    transition: right 0.15s ease-out;
    z-index: 1;
  }

  & input {
    border: 1px solid #c5d3e0;
    border-radius: 0;
    color: #2b3950;
    background-color: #fff;
  }
`;

export default PlatformToggleContainer;
