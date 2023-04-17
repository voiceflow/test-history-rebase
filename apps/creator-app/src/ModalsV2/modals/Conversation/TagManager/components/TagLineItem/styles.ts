import { styled } from '@/hocs/styled';

export const Container = styled.div`
  padding-bottom: 16px;
  padding-right: 55px;
  position: relative;

  :last-child {
    padding-bottom: 0px;
  }
`;

export const TrashIconContainer = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
`;
