import { FlexCenter, SvgIcon } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled.div`
  min-width: 60px;
  text-align: center;
`;

export const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;

  :hover ${SvgIcon.Container} {
    /* doing 'color' doesnt work for some reason */
    color: #8da2b5;
    transition: all 0.15s ease;
  }
`;

export const IconContainer = styled(FlexCenter)`
  margin-bottom: 5px;
`;

export const Label = styled.div`
  text-transform: uppercase;
  color: #6e849a;
  font-size: 11px;
  font-weight: 600;
  font-stretch: normal;
`;
