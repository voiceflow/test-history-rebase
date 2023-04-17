import { FlexApart } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled(FlexApart)`
  font-size: 13px;
  width: 100%;

  & > span {
    font-size: 13px !important;
  }
`;

export const DropdownContainer = styled.div`
  font-size: 15px;

  & > span {
    color: #62778c;
  }

  & > div {
    display: inline-block;
  }
`;
