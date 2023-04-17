import { inputStyle, SvgIcon } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const InputContainer = styled.div<{ error?: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  flex-grow: 1;

  ${SvgIcon.Container} {
    top: 18px;
    left: 46px;
    position: absolute;
    pointer-events: none;
    opacity: 0.85;
  }

  .PhoneInput {
    width: 100%;
  }

  .PhoneInputCountry {
    position: absolute;
    display: flex;
    align-items: center;
    align-self: stretch;
    height: 100%;
    margin-left: 16px;
    width: 38px;
  }
  .PhoneInputCountrySelect {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    cursor: pointer;
  }

  .PhoneInputCountryIcon {
    display: flex;
    align-items: center;
  }

  .PhoneInputCountryIconImg {
    height: 16px;
    width: 22px;
    border-radius: 3px;
  }

  .PhoneInputInput {
    ${inputStyle}
    padding-left: 65px;
  }
  .PhoneInputCountrySelectArrow {
    display: none;
  }
`;
