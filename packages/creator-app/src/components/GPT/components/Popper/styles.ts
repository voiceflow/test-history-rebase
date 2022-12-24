import { styled } from '@/hocs/styled';

export const Container = styled.div`
  z-index: ${({ theme }) => theme.zIndex.popper};
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  background-color: #2b2f32;
`;
