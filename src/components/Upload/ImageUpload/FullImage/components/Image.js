import { css, styled } from '@/hocs';

const Image = styled.div`
  width: 100%;
  border-radius: 5px;
  background-size: cover;
  background-position: top center;

  min-height: 30px;

  background-image: url(${({ src }) => src});

  ${({ ratio }) =>
    ratio &&
    css`
      padding-bottom: ${ratio}%;
    `};
`;

export default Image;
