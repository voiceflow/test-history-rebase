import { css, styled } from '@/hocs';

const AvatarContainer = styled.div`
  font-weight: 600;
  font-size: 19px;
  text-align: center;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px #fff, 0 0 0 1px #fff, 0 1px 2px 1px rgba(17, 49, 96, 0.16);
  display: flex;

  ${({ color }) => css`
    color: ${color.hex};
    background-color: #fff;
    background-image: ${({ avatarUrl }) =>
      avatarUrl ? `url(${avatarUrl}) ` : `linear-gradient(-180deg, ${color.rgbaFrom} 0%, ${color.rgbaTo} 97%)`};
    box-shadow: inset 0 0 0 1px #fff, 0 0 0 1px #fff, 0 1px 2px 1px rgba(17, 49, 96, 0.16);
    transition: box-shadow 0.15s linear;
  `}

  &:hover {
    border: 1px solid #fff;
    border-radius: 50%;
  }
`;

export default AvatarContainer;
