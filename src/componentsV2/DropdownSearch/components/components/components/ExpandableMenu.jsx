import styled from 'styled-components';

import { FlexCenter } from '@/componentsV2/Flex';

export const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: ${({ depth }) => depth > 0 && '0px 8px 16px rgba(17, 49, 96, 0.16), 0px 0px 0px rgba(17, 49, 96, 0.06)'};
  border-radius: 5px;
  border: none;
`;

export const InnerContainer = styled.div`
  padding: 8px 0px;
`;

export const Option = styled(FlexCenter)`
  padding: 10px 22px;
  cursor: pointer;

  &:hover {
    background: #deebff;
  }
`;

export const Label = styled.div`
  flex: 1;
  font-size: 15px;
  line-height: 18px;
  color: #132144;
  padding-right: 12px;
  font-weight: 600;
`;
