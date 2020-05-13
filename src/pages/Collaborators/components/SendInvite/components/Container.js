import { styled } from '@/hocs';

const Container = styled.div`
  border-bottom: 1px solid #eaeff4;
  padding: ${({ error }) => (error ? '0px 32px 0px 0px' : '0px 32px 16px 0px')};
  padding-top: 0;
  margin: 0;
`;

export default Container;
