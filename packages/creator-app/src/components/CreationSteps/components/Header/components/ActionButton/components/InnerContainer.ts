import { SvgIcon } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;

  :hover ${SvgIcon.Container} {
    /* doing 'color' doesnt work for some reason */
    color: #8da2b5;
    transition: all 0.15s ease;
  }
`;

export default InnerContainer;
