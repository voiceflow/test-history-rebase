import { styled } from '@/hocs';

const Icon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #d4d9e6;
  background-size: cover;
  background: ${({ background }) => background && `url(${background}) no-repeat center`};
`;

export default Icon;
