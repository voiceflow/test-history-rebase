import { styled, transition } from '@/hocs/styled';

export const ClusterCountBox = styled.div`
  ${transition('border-color')};

  border-radius: 6px;
  border: 1px solid #eaeff4;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
  padding: 5px 12px;

  &:hover {
    border-color: #dfe3ed;
  }
`;
