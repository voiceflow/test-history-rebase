import { styled } from '@/styles';

export const Container = styled.div`
  background: #33373a;
  border-radius: 8px;
  min-width: 122px;
  font-family: 'Open Sans', sans-serif;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.div`
  font-weight: 600;
  font-size: 13px;
  color: #c0c5c6;
  padding: 12px 16px 0 16px;
`;

export const Details = styled.div`
  font-weight: 400;
  font-size: 20px;
  color: #f2f7f7;
  padding: 0 16px 12px 16px;
`;

export const Percentage = styled.span`
  color: #f2f7f7;
`;

export const Total = styled.span`
  margin-left: 4px;
  color: #a2a7a8;
`;

export const Action = styled.div`
  padding: 10px 12px;
  margin: 0 4px 4px 4px;
  font-size: 13px;
  color: #f2f7f7;
  text-align: center;
  border: none;
  border-radius: 6px;
  background: #4b5052;
`;
