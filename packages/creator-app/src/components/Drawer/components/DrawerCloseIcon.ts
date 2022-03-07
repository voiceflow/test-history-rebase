import { styled } from '@/hocs';

const DrawerCloseIcon = styled.div<{ open?: boolean }>`
  position: absolute;
  top: 50%;
  opacity: 0.5;
  border-radius: 3px;
  background-image: linear-gradient(to bottom, rgba(110, 132, 154, 0.85), #6e849a), linear-gradient(to bottom, white, white);
  width: 4px;
  height: 20px;
  z-index: 25;

  @keyframes backgroundColorAnimation {
    from {
      background-image: linear-gradient(to bottom, rgba(61, 130, 226, 0.8), #3d82e2 100%), linear-gradient(to bottom, white, white);
    }
    to {
      background-image: linear-gradient(to bottom, rgba(110, 132, 154, 0.85), #6e849a), linear-gradient(to bottom, white, white);
    }
  }

  animation-name: backgroundColorAnimation;
  animation-duration: 0.15s;
`;

export default DrawerCloseIcon;
