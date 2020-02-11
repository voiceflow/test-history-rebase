import { styled } from '@/hocs';

const StepImage = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background: url(${({ image }) => image}) no-repeat center center;
  background-size: cover;
  box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.08), 0 0 1px 1px rgba(17, 49, 96, 0.08);
`;

export default StepImage;
