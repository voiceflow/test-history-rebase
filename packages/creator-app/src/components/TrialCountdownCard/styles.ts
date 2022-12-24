import { styled } from '@/hocs/styled';

export const CardContainer = styled.div`
  z-index: 100;
  width: 206px;
  position: relative;
  display: block;
  padding: 6px;
  left: 50%;
  font-size: 13px;
  border-radius: 8px;
  background-color: #33373a;
`;

export const CountdownText = styled.div`
  padding: 6px 16px 12px;
  display: flex;
  color: #a2a7a8;
`;

export const DaysContainer = styled.div`
  color: #f2f7f7;
  padding-right: 3px;
`;

export const ProgressContainer = styled.div`
  margin: 2px 16px 14px;
`;
