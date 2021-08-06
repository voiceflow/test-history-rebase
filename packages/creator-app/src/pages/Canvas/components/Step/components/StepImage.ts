import { styled } from '@/hocs';

export interface StepImageProps {
  image: string;
  position?: string;
}

const StepImage = styled.div<StepImageProps>`
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background: ${({ image, position = 'center center' }) => `url(${image}) no-repeat ${position}`};
  background-size: cover;
  box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.08), 0 0 1px 1px rgba(17, 49, 96, 0.08);
`;

export default StepImage;
