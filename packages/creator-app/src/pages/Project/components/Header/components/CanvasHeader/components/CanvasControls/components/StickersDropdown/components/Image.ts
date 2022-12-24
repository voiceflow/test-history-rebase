import { styled } from '@/hocs/styled';

export interface StickerProps {
  url: string;
  position?: string;
}

const Image = styled.div<StickerProps>`
  width: 100%;
  height: 100%;

  border-radius: 6px;
  background: ${({ url, position = 'center center' }) => `url(${url}) no-repeat ${position}`};
  background-size: contain;
`;

export default Image;
