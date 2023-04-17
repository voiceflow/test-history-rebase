import { styled } from '@/hocs/styled';

const TrainingLoader = styled.div`
  position: relative;
  width: 50%;
  height: 4px;
  border-radius: 3px;
  background: #fff;
  background: linear-gradient(180deg, rgba(223, 227, 237, 0.85) 0%, rgba(223, 227, 237, 1) 78%);
  overflow: hidden;

  &:before {
    content: ' ';
    position: absolute;
    height: 100%;
    width: 27%;
    border-radius: 3px;
    background: #fff;
    background: linear-gradient(180deg, rgba(93, 157, 245, 0.85) 0%, rgba(44, 133, 255, 1) 100%);
    animation: progress 2.1s ease infinite;
  }

  @keyframes progress {
    0% {
      left: -10%;
    }

    50% {
      left: 90%;
    }

    100% {
      left: -10%;
    }
  }
`;

export default TrainingLoader;
