import { styled } from '@ui/styles';

export const Container = styled.div`
  min-width: 122px;
  border-radius: 8px;
  background: #33373a;
  font-family: 'Open Sans', sans-serif;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.div`
  padding: 12px 16px 0 16px;
  color: #c0c5c6;
  font-weight: 600;
  font-size: 13px;
`;

export const Value = styled.div`
  padding: 0 16px 12px 16px;
  color: #f2f7f7;
  font-weight: 400;
  font-size: 20px;
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
