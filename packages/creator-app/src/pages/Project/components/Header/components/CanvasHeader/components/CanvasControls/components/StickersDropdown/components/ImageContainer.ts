import { styled } from '@/hocs/styled';

import { stickerSize } from '../constants';

const ImageContainer = styled.div`
  display: flex;

  width: ${stickerSize}px;
  height: ${stickerSize}px;

  cursor: pointer;

  :hover {
    transform: scale(1.1);
    transition: transform 0.2s ease-in-out;
  }
`;

export default ImageContainer;
