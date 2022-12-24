import { Flex } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

interface TrainContainerProps {
  isModelTraining?: boolean;
}

const TrainContainer = styled(Flex)<TrainContainerProps>`
  height: 277px;
  overflow: hidden;

  ${({ isModelTraining }) =>
    !isModelTraining &&
    css`
      padding-bottom: 21px;
    `}
`;

export default TrainContainer;
