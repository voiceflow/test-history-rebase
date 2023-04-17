import { styled } from '@/hocs/styled';

export const BodyContainer = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  margin: 20px 30px 0 30px;

  & > div {
    font-size: 15px;
    margin: 30px 40px;
  }
`;
