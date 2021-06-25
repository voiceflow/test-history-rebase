import { SvgIconContainer } from '@voiceflow/ui';

import { styled, transition } from '@/hocs';

const StyledBackButton = styled.button`
  ${transition('background-color')}

  display: flex;
  align-items: center;
  justify-content: center;
  width: 124px;
  height: 100%;
  padding: 0;
  margin-right: 24px;
  color: #132144;
  cursor: pointer;
  border: none;
  border-radius: 0;
  border-right: solid 1px #eaeff4;
  background-color: #fff;
  outline: none !important;
  box-shadow: none;

  ${SvgIconContainer} {
    margin-top: 2px;
    margin-right: 10px;
  }

  &:hover {
    background-color: #fbfbfb;
  }
`;

export default StyledBackButton;
