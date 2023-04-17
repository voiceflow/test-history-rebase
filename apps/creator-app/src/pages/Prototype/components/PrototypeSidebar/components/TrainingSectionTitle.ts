import { Flex } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

export enum TrainingSectionTitleVariant {
  IDLE,
  TRAINED,
  UNTRAINED,
}

interface TrainingSectionTitleProps {
  variant: TrainingSectionTitleVariant;
  statusVisible?: boolean;
}

const getColor = ({ variant }: TrainingSectionTitleProps) => {
  switch (variant) {
    case TrainingSectionTitleVariant.TRAINED:
      return '#5d9df5';
    case TrainingSectionTitleVariant.UNTRAINED:
      return '#e91e63';
    default:
      return '#c5d3e0';
  }
};

const getGradient = ({ variant }: TrainingSectionTitleProps) => {
  switch (variant) {
    case TrainingSectionTitleVariant.TRAINED:
      return 'linear-gradient(to bottom, rgba(93, 157, 245, 0.12), rgba(93, 157, 245, 0.24) 98%), linear-gradient(to bottom, #fff, #fff)';
    case TrainingSectionTitleVariant.UNTRAINED:
      return 'linear-gradient(to bottom, rgba(241, 70, 123, 0.12), rgba(241, 70, 123, 0.24)), linear-gradient(to bottom, #fff, #fff)';
    default:
      return 'linear-gradient(to bottom, rgba(231, 234, 241, 0.18), rgba(231, 234, 241, 0.51))';
  }
};

const TrainingSectionTitle = styled(Flex)<TrainingSectionTitleProps>`
  position: relative;
  overflow: hidden;

  &:before {
    ${transition('transform')}

    display: block;
    width: 10px;
    height: 10px;
    border: ${getColor} solid 1px;
    border-radius: 50%;
    background-image: ${getGradient};
    margin-right: 8px;
    content: '';

    transform: translateX(${({ statusVisible }) => (statusVisible ? 0 : -18)}px);
  }

  span {
    ${transition('transform')}
    transform: translateX(${({ statusVisible }) => (statusVisible ? 0 : -18)}px);
  }
`;

export default TrainingSectionTitle;
