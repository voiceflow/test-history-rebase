import { styled } from '@/hocs';

const Icon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #fff, 0 1px 2px 1px rgba(17, 49, 96, 0.16);
  background-size: cover;
  background: ${({ background }) => background && `url(${background}) no-repeat center`};
`;

export default Icon;
