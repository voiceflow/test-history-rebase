import { styled } from '@/hocs/styled';

export interface IconProps {
  background?: string | null;
}

const Icon = styled.div<IconProps>`
  width: 42px;
  height: 42px;
  background: ${({ background }) => background && `url(${background}) no-repeat center`};
  background-size: cover;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #fff, 0 1px 2px 1px rgba(17, 49, 96, 0.16);
`;

export default Icon;
